import Itemmodel from "../models/itemmodel.js";

export const addItem = async (req, res) => {
  try {
    const { name, price, description, longDescription, image, veg } = req.body;
    const item = await Itemmodel.create({ name, price, description, longDescription, image, veg });
    res.status(200).json({ message: "Item added successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const itemsdata = await Itemmodel.find().populate('variation').lean();
    return res.json({ success: true, itemsdata });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get data ${error.message}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Itemmodel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};