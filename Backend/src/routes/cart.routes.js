import {Router} from "express"
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity, createRazorpayOrder, verifyPayment, removeCartItem, createBuyNowOrder } from "../controllers/cart.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity } from "../validator/cart.validator.js"
const cartRouter = Router()

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @description add product to cart
 * @access Protected
 */
cartRouter.post("/add/:productId/:variantId",authenticateUser,validateAddToCart,addToCart)
/**
 * @route GET /api/cart
 * @description get all cart items
 * @access Protected
 */
cartRouter.get("/",authenticateUser,getCart)
/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @description increment cart item quantity
 * @access Protected
 */
cartRouter.patch("/quantity/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)
/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @description decrement cart item quantity
 * @access Protected
 */
cartRouter.patch("/quantity/decrement/:productId/:variantId",authenticateUser,validateDecrementCartItemQuantity,decrementCartItemQuantity)
/**
 * @route POST /api/cart/payment/create/order
 * @description create razorpay order
 * @access Protected
 */
cartRouter.post("/payment/create/order", authenticateUser,createRazorpayOrder)
/**
 * @route POST /api/cart/payment/verify
 * @description verify payment
 * @access Protected
 */
cartRouter.post("/payment/verify",authenticateUser,verifyPayment)

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @description remove cart item
 * @access Protected
 */
cartRouter.delete("/remove/:productId/:variantId",authenticateUser,removeCartItem)

/**
 * @route POST /api/cart/payment/buynow/:productId/:variantId
 * @description create razorpay order for a single item (Buy Now)
 * @access Protected
 */
cartRouter.post("/payment/buynow/:productId/:variantId", authenticateUser, createBuyNowOrder)

export default cartRouter