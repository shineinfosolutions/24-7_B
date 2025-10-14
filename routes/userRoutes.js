import express from 'express'
import { addUser, addwish, deleteaddress, getAddresses, getUserData, getwish } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/add', addUser)
userRouter.post('/data',  getUserData)


userRouter.get('/getwishlist',getwish)
userRouter.post('/addwish',addwish)
userRouter.post('/getaddresses', getAddresses);
userRouter.post('/deleteaddress', deleteaddress);

export default userRouter;