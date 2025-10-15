import express from "express";
import { addItem, getItems, deleteItem } from "../controller/itemController.js";
import upload from "../middleware/upload.js";

const itemRouter = express.Router();

itemRouter.post('/add', upload.single('image'), addItem);
itemRouter.get('/get', getItems);
itemRouter.delete('/delete', deleteItem);

export default itemRouter;