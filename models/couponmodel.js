import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String},
    condition: {type: String},
    discount: {type: Number},
    expiry: {type: Date},
    used: {type: Boolean},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const couponModel = mongoose.model.Coupon || mongoose.model('Coupon', couponSchema);

export default couponModel;