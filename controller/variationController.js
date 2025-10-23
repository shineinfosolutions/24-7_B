import Variationmodel from "../models/variationmodel.js";
import Itemmodel from "../models/itemmodel.js";

export const addVariation = async (req, res) => {
  try {
    const { name, price, stock, itemId } = req.body;
    
    const variation = await Variationmodel.create({ name, price, stock });
    
    // Link variation to item if itemId provided
    if (itemId) {
      const item = await Itemmodel.findById(itemId);
      if (!item) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      await Itemmodel.findByIdAndUpdate(itemId, { $push: { variation: variation._id } });
    }
    
    res.status(200).json({ message: "Variation added successfully", variation });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getVariations = async (req, res) => {
  try {
    const variations = await Variationmodel.find().lean();
    res.status(200).json({ message: "Variations fetched successfully", variations });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId } = req.body;
    
    const variation = await Variationmodel.findByIdAndDelete(id);
    if (!variation) {
      return res.status(404).json({ message: "Variation not found" });
    }
    
    // Remove variation from item if itemId provided
    if (itemId) {
      await Itemmodel.findByIdAndUpdate(itemId, { $pull: { variation: id } });
    }
    
    res.status(200).json({ message: "Variation deleted successfully", variation });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const updateVariation = async (req, res) => {
  try {
    const { id } = req.params; // variation ID from URL
    const { name, price, stock } = req.body;

    // Find and update variation
    const updatedVariation = await Variationmodel.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true, runValidators: true }
    );

    if (!updatedVariation) {
      return res.status(404).json({ message: "Variation not found" });
    }

    res.status(200).json({
      message: "Variation updated successfully",
      variation: updatedVariation,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      err: err.message,
    });
  }
};
