import {Router} from "express"
import { createProduct, getAllSellerProducts, getAllProducts, getProductDetails,addProductVariant } from "../controllers/product.controller.js"
import { authenticateSeller } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import { createProductValidator } from "../validator/product.validator.js"

const productRouter = Router()


productRouter.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct)
productRouter.get("/seller",authenticateSeller,getAllSellerProducts)
productRouter.get("/", getAllProducts)
productRouter.get("/:productId",getProductDetails)
productRouter.post("/product/:productId/variants",authenticateSeller,upload.array("images",7),addProductVariant)
export default productRouter