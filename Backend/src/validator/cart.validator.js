import {body, param, validationResult} from "express-validator"

const validateRequest = (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Invalid request",
                errors:errors.array()
            })
        }
        next()
    }

export const validateAddToCart = [
    param("productId").notEmpty().isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest
]


export const validateIncrementCartItemQuantity = [
    param("productId").notEmpty().isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest
]

export const validateDecrementCartItemQuantity = [
    param("productId").notEmpty().isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    validateRequest
]
