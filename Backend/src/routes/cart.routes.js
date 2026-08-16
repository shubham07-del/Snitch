import {Router} from "express"
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity } from "../controllers/cart.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity } from "../validator/cart.validator.js"
const cartRouter = Router()

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @description add product to cart
 * @access Protected
 */
cartRouter.post("/add/:productId/:variantId",authenticateUser,validateAddToCart,addToCart)
cartRouter.get("/",authenticateUser,getCart)
cartRouter.patch("/quantity/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)
cartRouter.patch("/quantity/decrement/:productId/:variantId",authenticateUser,validateDecrementCartItemQuantity,decrementCartItemQuantity)
export default cartRouter