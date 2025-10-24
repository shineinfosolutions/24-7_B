import express from "express";
import { createOrder, updateStatus, getOrders, getAllOrders, autoUpdateOrder, getOrderById, getOrderWithTimestamps, bulkUpdateStatus, getOrderStatus, getOrdersByStatus } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/create', createOrder);
orderRouter.put('/updatestatus/:orderId', updateStatus);
orderRouter.put('/bulk-update-status', bulkUpdateStatus);
orderRouter.get('/status/:orderId', getOrderStatus);
orderRouter.get('/by-status/:status', getOrdersByStatus);
orderRouter.post('/get', getOrders);
orderRouter.get('/getall', getAllOrders);
orderRouter.get('/get/:id', getOrderById);
orderRouter.post('/auto-update/:orderId', autoUpdateOrder);
orderRouter.get('/timeline/:orderId', getOrderWithTimestamps);

export default orderRouter;