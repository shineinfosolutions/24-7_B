import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    role: {type:String},
    phone:{type:String},
    password: {type:String}
})

const adminmodel = mongoose.model("admins",adminSchema);
export default adminmodel;