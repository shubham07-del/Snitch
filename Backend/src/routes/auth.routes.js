import {Router} from "express"
import { registerValidator } from "../validator/auth.validator.js"
import { registerUser } from "../controllers/auth.controller.js"

const authRouter = Router()

authRouter.post("/register", registerValidator,registerUser)



export default authRouter