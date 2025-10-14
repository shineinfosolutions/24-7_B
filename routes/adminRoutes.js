import e from "express";
import { addcoupon, addstaff, addvariation, adminLogin, adminLogout, deletevariation, getstaffs, getvariations } from "../controller/admincontroller.js";

const adminRouter = e.Router();
adminRouter.post('/adminlogin',adminLogin);
adminRouter.post('/adminlogout', adminLogout);
adminRouter.post('/addstaff', addstaff);
adminRouter.post('/addcoupon', addcoupon);

adminRouter.post('/addvariation', addvariation);
adminRouter.get('/getstaff', getstaffs);
adminRouter.get('/getvariation', getvariations);    

adminRouter.delete('/deletevariation', deletevariation);


export default adminRouter;