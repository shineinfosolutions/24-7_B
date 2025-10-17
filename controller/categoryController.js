import categoryModel from "../models/categorymodel.js";
import cloudinary from "../config/cloudinary.js";

export const addCategory = async (req, res) => {
  try {
    const { category, id } = req.body;
    let imageUrl = null;
    
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'categories' },
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
    
    const newCategory = await categoryModel.create({ category, id, image: imageUrl });
    res.status(200).json({ message: "Category added successfully", category: newCategory });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().lean();
    return res.json({ success: true, categories });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get data ${error.message}` });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    
    let imageUrl;
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'categories' },
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
    
    const updateData = { category };
    if (imageUrl) updateData.image = imageUrl;
    
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};