import Addonmodel from "../models/addonmodel.js";
import Itemmodel from "../models/itemmodel.js";

export const addAddon = async (req, res) => {
  try {
    const { name, price, description, category, veg, available, itemId } = req.body;
    
    const addon = await Addonmodel.create({ name, price, description, category, veg, available });
    
    // Link addon to item if itemId provided
    if (itemId) {
      const item = await Itemmodel.findById(itemId);
      if (!item) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      await Itemmodel.findByIdAndUpdate(itemId, { $push: { addon: addon._id } });
    }
    
    res.status(200).json({ message: "Addon added successfully", addon });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getAddons = async (req, res) => {
  try {
    const addons = await Addonmodel.find().lean();
    res.status(200).json({ message: "Addons fetched successfully", addons });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteAddon = async (req, res) => {
  try {
    const { addonId, itemId } = req.body;
    
    const addon = await Addonmodel.findByIdAndDelete(addonId);
    if (!addon) {
      return res.status(404).json({ message: "Addon not found" });
    }
    
    // Remove addon from item if itemId provided
    if (itemId) {
      await Itemmodel.findByIdAndUpdate(itemId, { $pull: { addon: addonId } });
    }
    
    res.status(200).json({ message: "Addon deleted successfully", addon });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};