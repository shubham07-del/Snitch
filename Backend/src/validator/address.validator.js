import {body,validationResult} from "express-validator"

export const validateAddressResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateAddress = [
    body("fullname").notEmpty().withMessage("Full name is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("pincode").notEmpty().withMessage("Pincode is required"),
    body("country").notEmpty().withMessage("Country is required"),
    validateAddressResult
]

