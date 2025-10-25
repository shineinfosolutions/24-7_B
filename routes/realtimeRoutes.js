import express from "express";
import orderModel from "../models/ordermodel.js";

const realtimeRouter = express.Router();

// Get recent orders for admin polling
realtimeRouter.get('/orders/recent', async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 60000); // Last minute
    
    const orders = await orderModel.find({
      createdAt: { $gte: sinceDate }
    }).populate('customer_id').populate('item_ids').sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get order status updates
realtimeRouter.get('/orders/updates', async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 60000);
    
    const orders = await orderModel.find({
      updatedAt: { $gte: sinceDate }
    }).populate('customer_id').populate('item_ids').sort({ updatedAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default realtimeRouter;