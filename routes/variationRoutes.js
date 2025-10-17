import express from "express";
import { addVariation, getVariations, deleteVariation, updateVariation } from "../controller/variationController.js";

const variationRouter = express.Router();

variationRouter.post('/add', addVariation);
variationRouter.get('/get', getVariations);
variationRouter.delete('/delete', deleteVariation);
variationRouter.put("/update/:id", updateVariation); 

export default variationRouter;