import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: false, trim: true },
  firebaseUid: { type: String, required: true },
  email: { type: String, lowercase: true, required: false },
  phone: { type: Number, required: false },
  dob: { type: String, required: false },
  anniversary: { type: String, required: false },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
  complaints: [{
    complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
    status: { type: String, enum: ['Open', 'Resolved', 'Pending'], default: 'Open' }
  }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true
});

const userModel =  mongoose.models.user || mongoose.model('user',customerSchema);
export default userModel;