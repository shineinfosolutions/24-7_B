import userModel from "../models/usermodel.js";
import wishmodel from "../models/wishmodel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      await userModel.create({
        name,
        email,
        phone,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false
      });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0;">Email Verification</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: #007bff; color: white; padding: 15px 30px; border-radius: 6px; display: inline-block; margin: 20px 0;">
              <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">This code will expire in 5 minutes</p>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      ` 
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "OTP sent to your email address", 
      email 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP expired" });
    }
    
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid credentials or unverified account" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, phone, dob, anniversary } = req.body;
    const user = await userModel.create({ name, email, phone, dob, anniversary });
    res.status(200).json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};
export const getUserData = async(req,res) =>
{
  try{
       const {email}  = req.body;
       const user  = await userModel.findOne({email}).populate('addresses');
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

export const getWishlistByUserId = async(req, res) => {
  try{
    const {userId} = req.params;
    const user = await wishmodel.findOne({user:userId}).populate('wishlist');
    if(!user) return res.json({success:false, message: 'user not found'});
    return res.json({success:true, wishlist: user.wishlist});
  }
  catch(error){
    return res.json({success:false, message: error.message});
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
    const { email } = req.body;
    const user = await userModel.findOne({ email }).populate('addresses');  
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
    const { email, addressId } = req.body;
    const user = await userModel.findOne({ email }); 
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

export const getSettings = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, settings: user.settings, rating: user.rating });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const updateSettings = async (req, res) => {
  try {
    const { email, settings } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.settings = { ...user.settings.toObject(), ...settings };
    user.markModified('settings');
    await user.save();
    return res.json({ success: true, message: 'Settings updated successfully', settings: user.settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const updateRating = async (req, res) => {
  try {
    const { email, rating } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.rating = rating;
    await user.save();
    return res.json({ success: true, message: 'Rating updated successfully', rating: user.rating });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const hideRestaurant = async (req, res) => {
  try {
    const { email, restaurantId } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.hiddenRestaurants.includes(restaurantId)) {
      user.hiddenRestaurants.push(restaurantId);
      await user.save();
    }
    return res.json({ success: true, message: 'Restaurant hidden successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const unhideRestaurant = async (req, res) => {
  try {
    const { email, restaurantId } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.hiddenRestaurants = user.hiddenRestaurants.filter(id => id.toString() !== restaurantId);
    await user.save();
    return res.json({ success: true, message: 'Restaurant unhidden successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const getHiddenRestaurants = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email }).populate('hiddenRestaurants');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, hiddenRestaurants: user.hiddenRestaurants });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

export const updateEmail = async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;
    const existingUser = await userModel.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const user = await userModel.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.email = newEmail;
    await user.save();
    return res.json({ success: true, message: 'Email updated successfully', email: user.email });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}
