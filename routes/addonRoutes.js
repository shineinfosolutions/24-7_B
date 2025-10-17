import express from "express";
import { addAddon, getAddons, deleteAddon, updateAddon} from "../controller/addonController.js";

const addonRouter = express.Router();

addonRouter.post('/add', addAddon);
addonRouter.get('/get', getAddons);
addonRouter.delete('/delete', deleteAddon);
addonRouter.put("/update/:id", updateAddon);

export default addonRouter;