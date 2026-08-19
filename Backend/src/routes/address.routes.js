import {Router} from "express"
import { validateAddress } from "../validator/address.validator.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { addressController, getAddress, updateAddress, deleteAddress, getAllAddresses } from "../controllers/address.controller.js"

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
addressRouter.get("/all",authenticateUser,getAllAddresses)

/**
 * @route GET /api/address
 * @description Get default address of the user
 * @access Private
 */
addressRouter.get("/",authenticateUser,getAddress)

/**
 * @route PUT /api/address/:id
 * @description Update an address
 * @access Private
 */
addressRouter.put("/:id",authenticateUser,updateAddress)

/**
 * @route DELETE /api/address/:id
 * @description Delete an address
 * @access Private
 */
addressRouter.delete("/:id",authenticateUser,deleteAddress)

export default addressRouter