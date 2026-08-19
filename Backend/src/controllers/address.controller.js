import addressModel from "../models/address.model.js";

export async function addressController(req,res) {
    try {
        const {fullname,phone,email,address,city,state,pincode,country} = req.body
        const user = req.user._id

        if(!fullname || !phone || !email || !address || !city || !state || !pincode || !country){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const userAddress = await addressModel.create({
            user,
            fullname,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            country
        })
        return res.status(200).json({success:true,message:"Address added successfully",userAddress})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

export async function getAddress(req,res) {
    const user = req.user._id
    const address = await addressModel.findOne({user})
    if(!address){
        return res.status(400).json({success:false,message:"Address not found"})
    }
    return res.status(200).json({success:true,message:"Address found",address})
}

export async function updateAddress(req, res) {
  try {
    const addressId = req.params.id;
    const updateData = req.body;
    const address = await addressModel.findOneAndUpdate({ _id: addressId, user: req.user._id }, updateData, { new: true });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    return res.status(200).json({ success: true, message: "Address updated successfully", address });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteAddress(req, res) {
  try {
    const addressId = req.params.id;
    const address = await addressModel.findOneAndDelete({ _id: addressId, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    return res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllAddresses(req, res) {
  try {
    const user = req.user._id;
    const addresses = await addressModel.find({ user });
    return res.status(200).json({ success: true, message: "Addresses found", addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}