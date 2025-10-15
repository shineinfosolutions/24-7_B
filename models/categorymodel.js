import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    id: {type:Number},
    category :{type:String},
    image: {type:String}
})

const categoryModel = mongoose.models.Category || 
    mongoose.model("Category", categorySchema);

export default categoryModel;