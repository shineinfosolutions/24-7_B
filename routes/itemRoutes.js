import express from "express";
import { addItem, getItems, deleteItem } from "../controller/itemController.js";
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
itemRouter.delete('/delete', deleteItem);

export default itemRouter;