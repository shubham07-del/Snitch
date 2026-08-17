import {Router} from "express"
import { validateAddress } from "../validator/address.validator.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { addressController, getAddress } from "../controllers/address.controller.js"

const addressRouter = Router()

/**
 * @route POST /api/address/add
 * @description Add a new address for the user
 * @access Private
 */
addressRouter.post("/add",authenticateUser,validateAddress,addressController)
/**
 * @route GET /api/address/all
 * @description Get all addresses of the user
 * @access Private
 */
addressRouter.get("/",authenticateUser,getAddress)

export default addressRouter