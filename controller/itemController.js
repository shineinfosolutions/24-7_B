import Itemmodel from "../models/itemmodel.js";
import categoryModel from "../models/categorymodel.js";
import Addonmodel from "../models/addonmodel.js";
import cloudinary from "../config/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, price, description, longDescription, veg, category, image } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }
    
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    let imageUrl = null;
    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'menu-items'
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
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
    
    // Manually populate addons
    for (let item of itemsdata) {
      if (item.addon && item.addon.length > 0) {
        const populatedAddons = await Addonmodel.find({ _id: { $in: item.addon } }).lean();
        item.addon = populatedAddons;
      }
    }
    
    return res.json({ success: true, itemsdata });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get data ${error.message}` });
  }
};

export const getFilteredItems = async (req, res) => {
  try {
    const { veg } = req.query;
    const filter = veg !== undefined ? { veg: veg === 'true' } : {};
    const itemsdata = await Itemmodel.find(filter).populate('variation').populate('category').lean();
    
    // Manually populate addons
    for (let item of itemsdata) {
      if (item.addon && item.addon.length > 0) {
        const populatedAddons = await Addonmodel.find({ _id: { $in: item.addon } }).lean();
        item.addon = populatedAddons;
      }
    }
    return res.json({ success: true, itemsdata });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get filtered data ${error.message}` });
  }
};

export const getSortedItems = async (req, res) => {
  try {
    const { veg, sortBy } = req.query;
    const filter = veg !== undefined ? { veg: veg === 'true' } : {};
    
    let sortOption = {};
    switch(sortBy) {
      case 'rating': sortOption = { rating: -1 }; break;
      case 'price_low': sortOption = { price: 1 }; break;
      case 'price_high': sortOption = { price: -1 }; break;
      case 'delivery': sortOption = { deliveryTime: 1 }; break;
      default: sortOption = { rating: -1 };
    }
    
    const itemsdata = await Itemmodel.find(filter).sort(sortOption).populate('variation').populate('category').lean();
    
    // Manually populate addons
    for (let item of itemsdata) {
      if (item.addon && item.addon.length > 0) {
        const populatedAddons = await Addonmodel.find({ _id: { $in: item.addon } }).lean();
        item.addon = populatedAddons;
      }
    }
    return res.json({ success: true, itemsdata });
  } catch (error) {
    return res.json({ success: false, message: `Unable to get sorted data ${error.message}` });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, longDescription, veg, category, available, image } = req.body;
    
    console.log('Image received:', image ? 'Yes' : 'No');
    
    const updateData = { 
      name, 
      price, 
      description, 
      longDescription, 
      veg, 
      category, 
      available,
      variation: req.body.variation || [],
      addon: req.body.addon || []
    };
    
    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'menu-items'
        });
        updateData.image = uploadResult.secure_url;
        console.log('Image uploaded:', uploadResult.secure_url);
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }
    
    const item = await Itemmodel.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const item = await Itemmodel.findByIdAndUpdate(
      id,
      { available },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item status updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      err: err.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    
    const item = await Itemmodel.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};