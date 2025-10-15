import express from 'express'
import { addUser, addwish, deleteaddress, getAddresses, getUserData, getwish, loginUser, registerUser, verifyOTP } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/login', loginUser)
userRouter.post('/add', addUser)
userRouter.post('/data',  getUserData)


userRouter.get('/getwishlist',getwish)
userRouter.post('/addwish',addwish)
userRouter.post('/getaddresses', getAddresses);
userRouter.post('/deleteaddress', deleteaddress);

export default userRouter;