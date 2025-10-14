import adminmodel from "../models/adminmodel.js";
import couponModel from "../models/couponmodel.js";
import Variationmodel from "../models/variationmodel.js";
import userModel from "../models/usermodel.js";


export const adminLogin = async(req,res) =>
{
  try{
   const {role,phone,password} = req.body;
   const admin = await adminmodel.findOne({role:role, phone:phone, password:password})
   console.log(admin);
   if(admin)
   {
    res.cookie("admin",admin._id,{httpOnly:true,secure:true,sameSite:"none"})
    res.status(200).json({message:"login successfull"})
   }
   else
   {
    res.status(400).json({message:"login failed",role:role, phone:phone, password:password,admin})
   }}
   catch(error)
   {
    res.status(500).json({message:"server error"})
   }
}


export const adminLogout = async(req, res) =>
{
  try{
    res.clearCookie("admin")
    res.status(200).json({message:"logout successfull"})
  }
  catch(error)
  {
    res.status(500).json({message:"server error"})
  }
}


export const addstaff = async(req, res) =>
{
  try{
    const {role,phone, password} = req.body;
    const staff = await adminmodel.create({ role, phone, password})
    res.status(200).json({message:"staff added successfully", staff})
  }
  catch(error)
  {
    res.status(500).json({message:"server error"})
  }
}

export const addcoupon = async(req, res) =>
{
  try{
    const {code,condition,discount, expiry , used,} = req.body;
    const coupon = await couponModel.create({ code,condition, discount, expiry, used})
    console.log(coupon,code);
    res.status(200).json({message:"coupon added successfully", coupon})
  }
  catch(error)
  {
    res.status(500).json({message:"server error",code, condition,discount, expiry, used})
  }
}

export const getstaffs = async(req, res) =>
{
  try{
    const staffs = await adminmodel.find()
    res.status(200).json({message:"staffs fetched successfully", staffs})
  }
  catch(error)
  {
    res.status(500).json({message:"server error"})
  }
}
export const getvariations = async(req,res) =>
{
  try{
    const variations = await Variationmodel.find()
    res.status(200).json({message:"variations fetched successfully", variations})
  }
  catch(error)
  {
    res.status(500).json({message:`server error${error}`})
  }

}


// export  const addvariation = async(req,res) =>
// {
//   try{
//     const {name, price, stock} = req.body;  
//     const variation = await Variationmodel.create({name, price,  stock})
//     res.status(200).json({message:"variation added successfully", variation})
//   }
//   catch(err)
//   {
//     res.status(500).json({message:"server error ", message: err.message})
//   }
// }

export const addvariation = async (req, res) => {
  try {
    const { name, price, stock, itemId } = req.body; 
    const variation = await Variationmodel.create({ name, price, stock });
    await variation.save();
    const updatedItem = await Itemmodel.findByIdAndUpdate(
      itemId,
      { $push: { variation: variation._id } },
      { new: true } 
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Variation added and linked to item successfully",
      variationId: variation._id,
      variation,
      updatedItem
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const deletevariation = async(req,res) =>
{
  try{
    const {variationId,itemId} = req.body;
    const variation = await Variationmodel.findByIdAndDelete(variationId);
    if(!variation)
    {
      return res.status(404).json({message:"variation not found"})
    }
    const updatedItem = await Itemmodel.findByIdAndUpdate(
      itemId,
      { $pull: { variation: variationId } },
      { new: true } 
    );
    if(updatedItem.modifiedCount === 0)
    {
      return res.status(404).json({message:"item not found"})
    }
    res.status(200).json({message:"variation deleted successfully", item: updatedItem});
  }
  catch(err)
  {
    res.status(500).json({message:"server error", err: err.message})
  }
}






// export const deletecategory = async(req,res) =>
// {
//   try {
//     const { categoryId } = req.body;
//     const category = await categoryModel.findByIdAndDelete(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json({ message: "Category deleted successfully", category });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", err: err.message });
//   }
// }