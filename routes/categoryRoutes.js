import express from "express";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../controller/categoryController.js";
import upload from "../middleware/upload.js";

const categoryRouter = express.Router();

categoryRouter.post('/add', addCategory);
categoryRouter.get('/get', getCategories);
categoryRouter.put('/update/:id', updateCategory);
categoryRouter.delete('/delete/:id', deleteCategory);

export default categoryRouter;