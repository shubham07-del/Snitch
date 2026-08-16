import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
export async function addToCart(req, res) {
    try {
        const {productId, variantId} = req.params
        const {quantity = 1} = req.body

        const product = await productModel.findOne({
            _id:productId,
            "variants._id":variantId
        })

        if(!product){
            return res.status(404).json({
                message:"Product not found",
                success:false
            })
        }

        const stock = await stockOfVariant(productId, variantId)
        const cart = (await cartModel.findOne({user:req.user._id})) || (await cartModel.create({user:req.user._id}))

        const productInCart = cart.items.find((item)=> item.product.toString() === productId && item.variant.toString() === variantId)

        if(productInCart){
            const quantityInCart = productInCart.quantity
            if(quantityInCart + quantity > stock){
                return res.status(400).json({
                    message:`You can only add ${stock - quantityInCart} more of this item`,
                    success:false
                })
            }

            await cartModel.findOneAndUpdate(
                {user:req.user._id, "items.product":productId,"items.variant":variantId},
                {$inc:{ "items.$.quantity": quantity }},
                {new:true}
            )
            return res.status(200).json({
                message:"cart updated successfully",
                success:true
            })
        }

        if(quantity>stock){
            return res.status(400).json({
                message:`Only ${stock} items are available`,
                success:false
            })
        }

        cart.items.push({
            product:productId,
            variant:variantId,
            quantity,
            price:product.price
        })
        await cart.save()
        res.status(200).json({
            message:"Product added to cart successfully",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export async function getCart(req,res) {
    const user = req.user
    let cart = (await cartModel.aggregate([
    {
        $match:{
            user: new mongoose.Types.ObjectId(user._id)
        }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        itemPrice: {
          $multiply: [
            '$items.quantity',
            '$items.product.variants.price.amount'
          ]
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        total: { $sum: '$itemPrice' },
        items: { $push: '$items' }
      }
    }
  ]))[0]
    if(!cart){
        cart = await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message:"Cart fetched successfully",
        success:true,
        cart
    })
}


export async function incrementCartItemQuantity(req,res) {
    try {
        const {productId, variantId} = req.params
        const quantity = req.body
        const product = await productModel.findOne({
            _id:productId,
            "variants._id":variantId
        })
        if(!product){
            return res.status(404).json({
                message:"Product not found",
                success:false
            })
        }

        const cart = await cartModel.findOne({
            user:req.user._id
        })

        if(!cart){
            return res.status(404).json({
                message:"Cart not found",
                success:false
            })
        }

        const productInCart = cart.items.find((item)=> item.product.toString() === productId && item.variant.toString() === variantId) || 0

        if(productInCart){
            const quantityInCart = productInCart.quantity
            const stock = await stockOfVariant(productId, variantId)
            if(quantityInCart + 1 > stock){
                return res.status(400).json({
                    message:`You can only add ${stock - quantityInCart} more of this item`,
                    success:false
                })
            }

            await cartModel.findOneAndUpdate(
                {user:req.user._id, "items.product":productId,"items.variant":variantId},
                {$inc:{ "items.$.quantity": 1 }},
                {new:true}
            )
            return res.status(200).json({
                message:"cart updated successfully",
                success:true
            })
        }

        if(1>stock){
            return res.status(400).json({
                message:`Only ${stock} items are available`,
                success:false
            })
        }

        cart.items.push({
            product:productId,
            variant:variantId,
            quantity:1,
            price:product.price
        })
        await cart.save()
        res.status(200).json({
            message:"Product added to cart successfully",
            success:true
        })
        
        
    } catch (error) {
         return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export async function decrementCartItemQuantity(req, res) {
    try {
        const { productId, variantId } = req.params

        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false })
        }

        const productInCart = cart.items.find(
            (item) => item.product.toString() === productId && item.variant.toString() === variantId
        )

        if (!productInCart) {
            return res.status(404).json({ message: "Item not in cart", success: false })
        }

        if (productInCart.quantity <= 1) {
            // Remove the item entirely when quantity would hit 0
            await cartModel.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: productId, variant: variantId } } },
                { new: true }
            )
            return res.status(200).json({ message: "Item removed from cart", success: true })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": -1 } },
            { new: true }
        )
        return res.status(200).json({ message: "Cart updated successfully", success: true })

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}