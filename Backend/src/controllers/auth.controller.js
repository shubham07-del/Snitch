import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res, message,status) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("token", token);

  res.status(status).json({
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
      role:isSeller?"seller":"buyer"
    });

    await sendTokenResponse(user, res, "user registered successfully.",201);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req,res)=>{
  const {email,password} = req.body

  try {
    
    let user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({
        message:"user not found",
      })
    }

    let isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid){
      return res.status(401).json({
        message:"invalid password",
      })
    }

    await sendTokenResponse(user, res, "user logged in successfully.",200);


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const googleLogin = async (req,res)=>{
  console.log(req.user)
  res.redirect("http://localhost:5173/")
}