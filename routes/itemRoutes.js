import express from "express";
import { addItem, getItems, updateItem, deleteItem, getFilteredItems, getSortedItems } from "../controller/itemController.js";
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
itemRouter.put('/update/:id', upload.single('image'), updateItem);
itemRouter.delete('/delete/:id', deleteItem);
export default itemRouter;   