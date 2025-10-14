import orderModel from "../models/ordermodel.js";
import userModel from "../models/usermodel.js";
import addressModel from "../models/addressmodel.js";
import Itemmodel from "../models/itemmodel.js";

export const createOrder = async (req, res) => {
  try {
    const { customer_id, address_id, item_ids } = req.body;

    // Validate customer exists
    const customer = await userModel.findById(customer_id);
    if (!customer) {
      return res.status(400).json({ message: "Invalid customer_id" });
    }

    // Validate address exists
    const address = await addressModel.findById(address_id);
    if (!address) {
      return res.status(400).json({ message: "Invalid address_id" });
    }

    // Validate all items exist
    for (const itemId of item_ids) {
      const item = await Itemmodel.findById(itemId);
      if (!item) {
        return res.status(400).json({ message: `Invalid item_id: ${itemId}` });
      }
    }

    const newOrder = new orderModel(req.body);
    const savedOrder = await newOrder.save();

    const updateduser = await userModel.findByIdAndUpdate(
      customer_id,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    res.status(201).json({ message: "Order placed", order: savedOrder, user: updateduser });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
      return res.status(400).json({ message: "newStatus is required in request body" });
    }
    
    await orderModel.findByIdAndUpdate(orderId, { status: newStatus });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    const user = await userModel
      .findOne({ firebaseUid })
      .populate({
        path: 'orders',
        populate: {
          path: 'items',
        },
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, orders: user.orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate('customer_id').lean();
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};