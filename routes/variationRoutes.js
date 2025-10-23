import express from "express";
import { addVariation, getVariations, deleteVariation, updateVariation, updateVariationStatus } from "../controller/variationController.js";

const variationRouter = express.Router();

variationRouter.post('/add', addVariation);
variationRouter.get('/get', getVariations);
variationRouter.delete('/delete/:id', deleteVariation);
variationRouter.put("/update/:id", updateVariation);
variationRouter.patch("/status/:id", updateVariationStatus); 

export default variationRouter;