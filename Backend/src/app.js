import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import addressRouter from "./routes/address.routes.js";

const app = express();
const isProd = config.NODE_ENV === "production";

// Security headers
app.use(helmet());

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

// Logger — dev only
if (!isProd) {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address",addressRouter)

// Global error handler — never leak stack traces in production
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = isProd ? "Internal server error" : err.message;
  res.status(status).json({ success: false, message });
});

export default app;
