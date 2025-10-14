import express from "express";
import { addCategory, getCategories, deleteCategory } from "../controller/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post('/add', addCategory);
categoryRouter.get('/get', getCategories);
categoryRouter.delete('/delete', deleteCategory);

export default categoryRouter;