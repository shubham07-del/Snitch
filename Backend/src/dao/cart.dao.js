import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetais(userId) {
    let cart = (await cartModel.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(userId)
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

      return cart
}