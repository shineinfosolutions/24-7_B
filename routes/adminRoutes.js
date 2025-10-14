import e from "express";
import { addcoupon, addstaff, adminLogin, adminLogout, getstaffs } from "../controller/admincontroller.js";

const adminRouter = e.Router();
adminRouter.post('/adminlogin',adminLogin);
adminRouter.post('/adminlogout', adminLogout);
adminRouter.post('/addstaff', addstaff);
adminRouter.post('/addcoupon', addcoupon);


adminRouter.get('/getstaff', getstaffs);
    




export default adminRouter;