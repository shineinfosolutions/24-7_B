import express from "express";
import { addItem, getItems, deleteItem } from "../controller/itemController.js";

const itemRouter = express.Router();

itemRouter.post('/add', addItem);
itemRouter.get('/get', getItems);
itemRouter.delete('/delete', deleteItem);

export default itemRouter;