import express from "express";
import { addVariation, getVariations, deleteVariation } from "../controller/variationController.js";

const variationRouter = express.Router();

variationRouter.post('/add', addVariation);
variationRouter.get('/get', getVariations);
variationRouter.delete('/delete', deleteVariation);

export default variationRouter;