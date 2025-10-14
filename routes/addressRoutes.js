import express from "express";
import { addAddress, getAddresses, deleteAddress } from "../controller/addressController.js";

const addressRouter = express.Router();

addressRouter.post('/add', addAddress);
addressRouter.post('/get', getAddresses);
addressRouter.delete('/delete', deleteAddress);

export default addressRouter;