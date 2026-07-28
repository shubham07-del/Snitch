import { body, validationResult } from 'express-validator';


// Validate function middleware (kept in this file as requested)
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


// Validation rules for user registration
export const registerValidator = [
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email'),
    body('contact')
        .isNumeric().withMessage('Contact must be a valid number')
        .matches(/^[6-9]\d{9}$/).withMessage('Contact must be 10 digits and start with 6, 7, 8, or 9'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname')
        .trim()
        .notEmpty().withMessage('Fullname is required'),
    body("isSeller").isBoolean().withMessage("isSeller must be a boolean"),
    validate
];

// Validation rules for user login
export const loginValidator = [
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

