import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  lat: { type:Number, required: true },
  lng: { type:Number, required: true },
  address_id:{type:String},
  type:{type:String,required:true,trim:true},
  house_no:{type:Number,required:true ,trim:true},
  street: { type: String, required: true ,trim:true},
  city: { type: String, required: true ,trim:true},
  state: { type: String, required: true ,trim:true},
  postalCode: { type: String, required: true ,trim:true},
}, { timestamps: true });

const addressModel = mongoose.models.Address || mongoose.model('Address', addressSchema);
export default addressModel;    

