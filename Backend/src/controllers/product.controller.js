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
        variants: [
            {
                images: images.map((img) => ({ url: img.url })),
                stock: req.body.stock || 0,
                attributes: req.body.attributes ? JSON.parse(req.body.attributes) : {},
                price: {
                    amount: priceAmount,
                    currency: priceCurrency || "INR"
                }
            }
        ]
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

export async function addProductVariant(req,res) {

    const {productId} = req.params
    const product = await productModel.findOne({
        _id:productId,
        seller:req.user._id
    })
    if(!product){
        return res.status(404).json({
            message:"Product not found.",
            success:false
        })
    }
    
    const files = req.files
    const images = []
    if(files || files.length !== 0){
        (await Promise.all(files.map(async (file)=>{
            const image = await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname
            })
            return image
        }))).map((image)=>images.push(image))
    }
    
    const stock = req.body.stock || 0;
    const priceAmount = req.body.priceAmount || product.price.amount;
    const priceCurrency = req.body.priceCurrency || product.price.currency
    const attributes = JSON.parse(req.body.attributes || "{}");

    const newVariant = {
        images,
        stock,
        attributes
    };

    if (priceAmount) {
        newVariant.price = {
            amount: priceAmount,
            currency: priceCurrency
        };
    }

    product.variants.push(newVariant);
    await product.save();

    return res.status(201).json({
        success: true,
        message: "Variant added successfully",
        variant: product.variants[product.variants.length - 1]
    });
}