import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

const isProd = config.NODE_ENV === "production";

function createToken(userId) {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "10d" });
}

function setCookieAndRespond(res, token, status, body) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.status(status).json(body);
}

async function sendTokenResponse(user, res, message, status) {
  const token = createToken(user._id);
  setCookieAndRespond(res, token, status, {
    message,
    success: true,
    token, // Send token in JSON payload for local storage
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const registerUser = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    let user = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (user) {
      return res.status(400).json({
        message: "user already exist.",
      });
    }

    user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "user registered successfully.", 201);
  } catch (err) {
    console.error("[registerUser]", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    let isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "invalid password",
      });
    }

    await sendTokenResponse(user, res, "user logged in successfully.", 200);
  } catch (error) {
    console.error("[loginUser]", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { id, displayName, emails } = req.user;

  const email = emails[0].value;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        email,
        fullname: displayName,
        googleId: id,
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${config.FRONTEND_URL}/?token=${token}`);
  } catch (error) {
    console.error("[googleLogin]", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    let token = req.cookies.token;
    if(!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Not authenticated", user: null });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", user: null });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated", user: null });
  }
};

export const logoutUser = async (req,res)=>{
 const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(201).json({
    message: "User logout successfully."
  });
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, contact, email } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullname) user.fullname = fullname;
    if (contact) user.contact = contact;
    if (email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};