import "dotenv/config"


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined at environment variable.")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined at environment variable.")
}

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Google credentials are not defined at environment variable.")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined at environment variable.")
}

if(!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET){
    throw new Error("Razorpay credentials are not defined at environment variable.")
}

if(!process.env.FRONTEND_URL){
    throw new Error("FRONTEND_URL is not defined at environment variable.")
}

if(!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD){
    throw new Error("Redis credentials are not defined at environment variable.")
}
export const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    NODE_ENV:process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_API_KEY:process.env.RAZORPAY_API_KEY,
    RAZORPAY_API_SECRET:process.env.RAZORPAY_API_SECRET,
    FRONTEND_URL:process.env.FRONTEND_URL,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD
}