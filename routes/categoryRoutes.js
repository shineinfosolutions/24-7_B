import express from "express";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../controller/categoryController.js";
import upload from "../middleware/upload.js";

const categoryRouter = express.Router();

categoryRouter.post('/add', upload.single('image'), (req, res, next) => {
  try {
    addCategory(req, res, next);
  } catch (error) {
    next(error);
  }
});
categoryRouter.get('/get', getCategories);
categoryRouter.put('/update/:id', upload.single('image'), updateCategory);
categoryRouter.delete('/delete/:id', deleteCategory);

export default categoryRouter;