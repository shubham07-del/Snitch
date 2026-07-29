import {Router} from "express"
import { loginValidator, registerValidator } from "../validator/auth.validator.js"
import { googleLogin, loginUser, registerUser } from "../controllers/auth.controller.js"
import passport from "passport"

const authRouter = Router()


authRouter.post("/register", registerValidator,registerUser)
authRouter.post("/login", loginValidator,loginUser)
authRouter.get("/google",passport.authenticate("google",{
    scope:["profile","email"]
}))
authRouter.get("/google/callback",passport.authenticate("google",{
    session:false
}), googleLogin
)


export default authRouter