import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {type:String},
    price:{type:String},
    originalPrice:{type:String},
    quantity: {type:String},
    description:{type:String},
    longDescription:{type:String},
    image:{type:String},
    veg:{type:Boolean},
    rating:{type:Number},
    variation: [{ type: mongoose.Schema.Types.ObjectId, ref:'variations'}],
    addon: [{ type: mongoose.Schema.Types.ObjectId,ref :'Addonmodel'}]
})

const Itemmodel =mongoose.models.items || mongoose.model('items',itemSchema);
export default Itemmodel;
