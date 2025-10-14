import express from "express";
import { addAddon, getAddons, deleteAddon } from "../controller/addonController.js";

const addonRouter = express.Router();

addonRouter.post('/add', addAddon);
addonRouter.get('/get', getAddons);
addonRouter.delete('/delete', deleteAddon);

export default addonRouter;