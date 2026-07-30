import {Router} from "express"
import { createProduct, getAllProducts } from "../controllers/product.controller.js"
import { authenticateSeller } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import { createProductValidator } from "../validator/product.validator.js"

const productRouter = Router()


productRouter.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct)
productRouter.get("/seller",authenticateSeller,getAllProducts)
export default productRouter