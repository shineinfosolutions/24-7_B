import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    id: {type:Number},
    category :{type:String}
})

const categoryModel = mongoose.model.Category ||mongoose.model("Category",categorySchema); 
export default categoryModel;   