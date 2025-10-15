import express from "express";
import { addCategory, getCategories, deleteCategory } from "../controller/categoryController.js";
import upload from "../middleware/upload.js";

const categoryRouter = express.Router();

categoryRouter.post('/add', upload.single('image'), addCategory);
categoryRouter.get('/get', getCategories);
categoryRouter.delete('/delete', deleteCategory);

export default categoryRouter;