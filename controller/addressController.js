import addressModel from "../models/addressmodel.js";
import userModel from "../models/usermodel.js";

export const addAddress = async (req, res) => {
  try {
    const { userId, type, nickname, fullAddress, house_no, street, landmark, city, state, postalCode, lat, lng, isDefault } = req.body;
    
    // Validate user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Validate nickname is provided when type is Other
    if (type === 'Other' && !nickname) {
      return res.status(400).json({ message: "Nickname is required when address type is Other" });
    }
    
    // If this is set as default, remove default from other addresses
    if (isDefault) {
      const userAddresses = await userModel.findById(userId).populate('addresses');
      for (const addr of userAddresses.addresses) {
        await addressModel.findByIdAndUpdate(addr._id, { isDefault: false });
      }
    }
    
    const address = await addressModel.create({ 
      type, nickname, fullAddress, house_no, street, landmark, city, state, postalCode, lat, lng, isDefault 
    });
    
    // Add address to user's addresses array
    await userModel.findByIdAndUpdate(userId, { $push: { addresses: address._id } });
    
    res.status(200).json({ message: "Address saved successfully", address });
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

export const updateAddress = async (req, res) => {
  try {
    const { addressId, type, nickname, fullAddress, house_no, street, landmark, city, state, postalCode, lat, lng, isDefault } = req.body;
    
    // Validate address exists
    const existingAddress = await addressModel.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    // Validate nickname is provided when type is Other
    if (type === 'Other' && !nickname) {
      return res.status(400).json({ message: "Nickname is required when address type is Other" });
    }
    
    // If this is set as default, remove default from other addresses
    if (isDefault) {
      await addressModel.updateMany({}, { isDefault: false });
    }
    
    const updatedAddress = await addressModel.findByIdAndUpdate(
      addressId,
      { type, nickname, fullAddress, house_no, street, landmark, city, state, postalCode, lat, lng, isDefault },
      { new: true }
    );
    
    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Remove address from user's addresses array if userId provided
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { $pull: { addresses: id } });
    }
    
    // Delete the address
    const address = await addressModel.findByIdAndDelete(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};