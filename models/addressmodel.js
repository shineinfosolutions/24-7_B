import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Home', 'Work', 'Other'] }, // Location type
  nickname: { 
    type: String, 
    trim: true,
    required: function() {
      return this.type === 'Other';
    }
  }, // Required when type is Other
  fullAddress: { type: String, required: true, trim: true }, // Complete address string
  house_no: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true }, // Near Metro Station, etc.
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isDefault: { type: Boolean, default: false }, // Default delivery address
}, { timestamps: true });

const addressModel = mongoose.models.UserAddress || mongoose.model('UserAddress', addressSchema);
export default addressModel;    

