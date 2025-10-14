import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import itemRouter from "./routes/itemRoutes.js";


const app = express();
const port = process.env.PORT || 4000
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173','zomato-frontend-blush.vercel.app'],
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


app.listen(port, ()=>console.log(`Server started on PORT: ${port}`));