import express from "express";
import { createOrder, updateStatus, getOrders, getAllOrders } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/create', createOrder);
orderRouter.put('/updatestatus/:orderId', updateStatus);
orderRouter.post('/get', getOrders);
orderRouter.get('/getall', getAllOrders);

export default orderRouter;