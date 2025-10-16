import express from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress } from "../controller/addressController.js";

const addressRouter = express.Router();

addressRouter.post('/add', addAddress);
addressRouter.post('/get', getAddresses);
addressRouter.put('/update', updateAddress);
addressRouter.delete('/delete', deleteAddress);

export default addressRouter;