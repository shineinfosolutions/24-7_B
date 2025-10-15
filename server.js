import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addonRouter from "./routes/addonRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import variationRouter from "./routes/variationRoutes.js";


const app = express();
const port = process.env.PORT || 4000
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173','https://24-7-b.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// API Endpoints
app.get("/", (req, res) => { 
    res.send("API is working fine");
  });
  

app.use('/api/user',userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/category', categoryRouter)
app.use('/api/item', itemRouter)
app.use('/api/order', orderRouter)
app.use('/api/addon', addonRouter)
app.use('/api/address', addressRouter)
app.use('/api/variation', variationRouter)


app.listen(port, ()=>console.log(`Server started on PORT: ${port}`));