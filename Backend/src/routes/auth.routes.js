import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validator/auth.validator.js";
import {
  googleLogin,
  loginUser,
  registerUser,
  getMe,
  logoutUser,
  updateProfile,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerUser);
authRouter.post("/login", loginValidator, loginUser);
authRouter.get("/me", getMe);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.FRONTEND_URL}/login`,
  }),
  googleLogin,
);


authRouter.get("/logout",authenticateUser,logoutUser)
authRouter.put("/profile", authenticateUser, updateProfile)
export default authRouter;
