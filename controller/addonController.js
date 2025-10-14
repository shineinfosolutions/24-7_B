import Addonmodel from "../models/addonmodel.js";

export const addAddon = async (req, res) => {
  try {
    const { name, price, description, category, veg, available } = req.body;
    const addon = await Addonmodel.create({ name, price, description, category, veg, available });
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
    const { addonId } = req.body;
    const addon = await Addonmodel.findByIdAndDelete(addonId);
    if (!addon) {
      return res.status(404).json({ message: "Addon not found" });
    }
    res.status(200).json({ message: "Addon deleted successfully", addon });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};