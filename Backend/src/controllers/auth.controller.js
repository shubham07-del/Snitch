import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(req, res, message) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("token", token);

  res.status(201).json({
    message: message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role:user.role
    },
  });
}
export const registerUser = async (req, res) => {
  const { email, contact, password, fullname } = req.body;

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
      role:isSeller?"seller":"buyer"
    });

    await sendTokenResponse(user, res, "user registered successfully.");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
