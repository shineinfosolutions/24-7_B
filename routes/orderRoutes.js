import express from "express";
import { createOrder, updateStatus, getOrders, getAllOrders, autoUpdateOrder, getOrderWithTimestamps } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/create', createOrder);
orderRouter.put('/updatestatus/:orderId', updateStatus);
orderRouter.post('/get', getOrders);
orderRouter.get('/getall', getAllOrders);
orderRouter.post('/auto-update/:orderId', autoUpdateOrder);
orderRouter.get('/timeline/:orderId', getOrderWithTimestamps);

export default orderRouter;