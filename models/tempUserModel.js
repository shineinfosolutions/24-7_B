import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

const tempUserModel = mongoose.models.TempUser || mongoose.model('TempUser', tempUserSchema);
export default tempUserModel;