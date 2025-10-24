import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addonRouter from "./routes/addonRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import variationRouter from "./routes/variationRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import filterRouter from "./routes/filterRoutes.js";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://zomato-frontend-blush.vercel.app",
      "http://127.0.0.1:5500",
      "https://zomato-frontend-xi.vercel.app",
      "https://zomato-admin-seven.vercel.app",
    ],
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io available globally
app.set('io', io);

connectDB();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://zomato-frontend-blush.vercel.app",
      "http://127.0.0.1:5500",
      "https://zomato-frontend-xi.vercel.app",
      "https://zomato-admin-seven.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API Endpoints
app.get("/", (req, res) => {
  res.send("API is working fine");
});

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/addon", addonRouter);
app.use("/api/address", addressRouter);
app.use("/api/variation", variationRouter);
app.use("/api/search", searchRouter);
app.use("/api/cart", cartRouter);
app.use("/api/filter", filterRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join admin room for receiving order updates
  socket.on('join-admin', () => {
    socket.join('admin');
    console.log('Admin joined:', socket.id);
  });
  
  // Join user room for receiving order status updates
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined:`, socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => console.log(`Server started on PORT: ${port}`));
