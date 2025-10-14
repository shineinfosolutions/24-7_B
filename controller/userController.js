import userModel from "../models/usermodel.js";
import wishmodel from "../models/wishmodel.js";
export const getUserData = async(req,res) =>
{
  try{
       const {firebaseUid}  = req.body;
       const user  = await userModel.findOne({firebaseUid});
       if(!user)return res.json({success:false, message: 'user not found'});
    

        res.json({success:true,user});

  }
  catch(error)
  {
    return res.json({success:false, message: `${error}`});

  }
}




export const getwish = async(req, res) =>
{
  try{
    const {userId} = req.body;
    const user = await wishmodel.findOne({user:userId}).populate('wishlist');
    if(!user)return res.json({success:false, message: 'user not found'});
    return res.json({success:true, wishlist: user.wishlist});
  }
  catch(error)
  {
    return res.json({success:false, message: 'server error',message: error.message});
  }
}

export const addwish = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    let wishlistDoc = await wishmodel.findOne({ user: userId });

    if (!wishlistDoc) {
      wishlistDoc = await wishmodel.create({
        user: userId,
        wishlist: [itemId]
      });
    } else {
      wishlistDoc.wishlist.push(itemId);
      await wishlistDoc.save();
    }

    return res.json({ success: true, message: 'Wish added', data: wishlistDoc });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    const user = await userModel.findOne({ firebaseUid }).populate('addresses');  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}
export const deleteaddress = async (req, res) => {
  try {
    const { firebaseUid, addressId } = req.body;
    const user = await userModel.findOne({ firebaseUid }); 
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.addresses = user.addresses.filter(id => id.toString() !== addressId);
    await user.save();
    return res.json({ success: true, message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {  
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}
export const getOrders = async (req, res) => {
  try {
    const { firebaseUid } = req.body;
  const user = await userModel
  .findOne({ firebaseUid })
  .populate({
    path: 'orders',
    populate: {
      path: 'items',
    },
  });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, orders: user.orders });
  }
  catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}