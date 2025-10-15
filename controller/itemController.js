import Itemmodel from "../models/itemmodel.js";
import categoryModel from "../models/categorymodel.js";
import cloudinary from "../config/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, price, description, longDescription, veg, category } = req.body;
    
    // Input validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }
    
    // Validate category exists
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    let imageUrl = null;
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'menu-items' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      
      const uploadResult = await uploadPromise;
      imageUrl = uploadResult.secure_url;
    }
    
    const item = await Itemmodel.create({ name, price, description, longDescription, image: imageUrl, veg, category });
    res.status(200).json({ message: "Item added successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const itemsdata = await Itemmodel.find().populate('variation').populate('category').lean();
    return res.json({ success: true, itemsdata });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get data ${error.message}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    // Input validation
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    
    const item = await Itemmodel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};