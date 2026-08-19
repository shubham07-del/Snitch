import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetais } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
import { sendOrderConfirmationEmail } from "../services/mail.service.js";
import addressModel from "../models/address.model.js";

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
    let cart = await getCartDetais(req.user._id)
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

export async function createRazorpayOrder(req,res) {
    try {
        const cart = await getCartDetais(req.user._id)
        if(!cart){
            return res.status(404).json({
                message:"Cart not found"
            })
        }

        const order = await createOrder({amount:cart.total, currency:"INR"})
        const payment = await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id
            },
            price: {
                amount: cart.total,
                currency: "INR"
            },
            orderItems: cart.items.map((item) => ({
                title: item.product.productName,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: item.product.variants?.images ?? [],
                description: item.product.description ?? "",
                price: {
                    amount: item.product.variants?.price?.amount,
                    currency: item.product.variants?.price?.currency ?? "INR"
                }
            }))
        })
        return res.status(200).json({
            message:"Order created successfully",
            success:true,
            order
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export async function verifyPayment(req,res) {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status:"pending"
    })

    if(!payment){
        return res.status(404).json({
            message:"Payment not found",
            success:false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id:razorpay_order_id,
        payment_id:razorpay_payment_id,
    },razorpay_signature,config.RAZORPAY_API_SECRET)

    if(!isPaymentValid){
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message:"Invalid payment",
            success:false
        })
    }

    payment.status = "paid"
    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature
    await payment.save()

    // Clear the cart after successful payment
    await cartModel.findOneAndUpdate(
        { user: payment.user },
        { $set: { items: [] } }
    )
    
    // Fetch user and latest address to send confirmation email
    const user = req.user;
    const userAddress = await addressModel.findOne({ user: payment.user }).sort({ createdAt: -1 });
    
    // Send email asynchronously without blocking the response
    sendOrderConfirmationEmail(user, payment, userAddress).catch(err => console.error(err));

    return res.status(200).json({
        message:"Payment verified successfully",
        success:true
    })
}


export async function removeCartItem(req,res) {
    try {
        const {productId, variantId} = req.params
        const cart = await cartModel.findOne({
            user:req.user._id
        })
        if(!cart){
            return res.status(404).json({
                message:"Cart not found",
                success:false
            })
        }
        const productInCart = cart.items.find((item)=> item.product.toString() === productId && item.variant.toString() === variantId)
        if(!productInCart){
            return res.status(404).json({
                message:"Item not in cart",
                success:false
            })
        }
        cart.items = cart.items.filter((item)=> item.product.toString() !== productId || item.variant.toString() !== variantId)
        await cart.save()
        return res.status(200).json({
            message:"Cart updated successfully",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

/**
 * Buy Now — creates a Razorpay order for a single product variant directly,
 * without touching the cart.
 */
export async function createBuyNowOrder(req, res) {
    try {
        const { productId, variantId } = req.params

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false })
        }

        const variant = product.variants.find(v => v._id.toString() === variantId)
        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false })
        }

        const amount = variant.price?.amount ?? product.price?.amount
        const currency = variant.price?.currency ?? product.price?.currency ?? "INR"

        if (!amount) {
            return res.status(400).json({ message: "Product price not set", success: false })
        }

        const order = await createOrder({ amount, currency })

        await paymentModel.create({
            user: req.user._id,
            razorpay: { orderId: order.id },
            price: { amount, currency },
            orderItems: [{
                title: product.productName,
                productId: product._id,
                variantId: variant._id,
                quantity: 1,
                images: variant.images ?? [],
                description: product.description ?? "",
                price: { amount, currency }
            }]
        })

        return res.status(200).json({
            message: "Buy now order created successfully",
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}