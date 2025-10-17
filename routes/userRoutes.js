import express from 'express'
import { addUser, addwish, deleteaddress, getAddresses, getHiddenRestaurants, getSettings, getUserData, getwish, getWishlistByUserId, hideRestaurant, loginUser, registerUser, unhideRestaurant, updateEmail, updateRating, updateSettings } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
//userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/login', loginUser)
userRouter.post('/add', addUser)
userRouter.post('/data',  getUserData)


userRouter.get('/getwishlist',getwish)
userRouter.get('/wishlist/:userId', getWishlistByUserId)
userRouter.post('/addwish',addwish)
userRouter.post('/getaddresses', getAddresses);
userRouter.post('/deleteaddress', deleteaddress);
// Settings CRUD routes
userRouter.get('/settings/:email', getSettings);
userRouter.put('/settings', updateSettings);
userRouter.put('/rating', updateRating);
userRouter.put('/email', updateEmail);
userRouter.post('/restaurant/hide', hideRestaurant);
userRouter.delete('/restaurant/hide', unhideRestaurant);
userRouter.get('/restaurants/hidden/:email', getHiddenRestaurants);

export default userRouter;