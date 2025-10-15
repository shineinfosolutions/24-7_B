import express from "express";
import { addItem, getItems, deleteItem, getFilteredItems, getSortedItems } from "../controller/itemController.js";
import upload from "../middleware/upload.js";

const itemRouter = express.Router();

itemRouter.post('/add', upload.single('image'), (req, res, next) => {
  try {
    addItem(req, res, next);
  } catch (error) {
    next(error);
  }
});
itemRouter.get('/get', getItems);
itemRouter.get('/filter', getFilteredItems);
itemRouter.get('/sort', getSortedItems);
itemRouter.delete('/delete', deleteItem);
export default itemRouter;   