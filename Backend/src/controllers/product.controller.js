import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

export async function createProduct(req,res) {
    const {productName, description, priceAmount, priceCurrency} = req.body
    const seller = req.user


    const images = await Promise.all(req.files.map(async (file)=>{
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        productName,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency || "INR"
        },
        seller:seller._id,
        images:images.map((img)=>{
            return{
                url:img.url,
            }
        }),

    })

    res.status(201).json({
        message:"Product created successfully.",
        success:true,
        product
    })
}


export async function getAllSellerProducts(req,res){
    const seller = req.user

    const products = await productModel.find({
        seller:seller._id
    })

    res.status(200).json({
        message:"all products fetched successfully.",
        success:true,
        products
    })
}

export async function getAllProducts(req, res) {
    const products = await productModel.find()

    if(!products){{
        return res.status(200).json({
            message:"No product found.",
            success:true
        })
    }}
    res.status(200).json({
        message:"Products fetched successfully.",
        success:true,
        products
    })
}

export async function getProductDetails(req,res) {
    const {productId} = req.params

    const product = await productModel.findById(productId)
    res.status(200).json({
        message:"Product fetched successfully.",
        success:true,
        product
    })
}