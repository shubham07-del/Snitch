import { body, validationResult } from "express-validator";

// Shared validate middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const ALLOWED_CURRENCIES = ["INR", "USD", "JPY", "GBP", "EUR"];
const MAX_IMAGES = 7;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// ─── Create Product Validator ────────────────────────────────────────────────
export const createProductValidator = [
    body("productName")
        .trim()
        .notEmpty().withMessage("Product name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),

    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters"),

    body("priceAmount")
        .notEmpty().withMessage("Price amount is required")
        .isFloat({ gt: 0 }).withMessage("Price must be a positive number")
        .toFloat(),

    body("priceCurrency")
        .optional()
        .trim()
        .toUpperCase()
        .isIn(ALLOWED_CURRENCIES)
        .withMessage(`Currency must be one of: ${ALLOWED_CURRENCIES.join(", ")}`),

    // Validate the uploaded files (req.files injected by multer)
    body().custom((_, { req }) => {
        const files = req.files;

        if (!files || files.length === 0) {
            throw new Error("At least one product image is required");
        }

        if (files.length > MAX_IMAGES) {
            throw new Error(`You can upload a maximum of ${MAX_IMAGES} images`);
        }

        for (const file of files) {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                throw new Error(
                    `Invalid file type "${file.mimetype}". Allowed types: JPEG, PNG, WebP, AVIF`
                );
            }

            // 10 MB per file
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`File "${file.originalname}" exceeds the 10 MB size limit`);
            }
        }

        return true;
    }),

    validate,
];
