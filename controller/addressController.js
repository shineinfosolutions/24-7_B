import addressModel from "../models/addressmodel.js";
import userModel from "../models/usermodel.js";

export const addAddress = async (req, res) => {
  try {
    const { userId, lat, lng, type, house_no, street, city, state, postalCode } = req.body;
    
    // Validate user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const address = await addressModel.create({ lat, lng, type, house_no, street, city, state, postalCode });
    
    // Add address to user's addresses array
    await userModel.findByIdAndUpdate(userId, { $push: { addresses: address._id } });
    
    res.status(200).json({ message: "Address added successfully", address });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).populate('addresses');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;
    
    // Remove address from user's addresses array
    await userModel.findByIdAndUpdate(userId, { $pull: { addresses: addressId } });
    
    // Delete the address
    const address = await addressModel.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};