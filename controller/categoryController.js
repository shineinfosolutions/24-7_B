import categoryModel from "../models/categorymodel.js";

export const addCategory = async (req, res) => {
  try {
    const { category, id } = req.body;
    const newCategory = await categoryModel.create({ category, id });
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