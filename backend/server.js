import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from './routes/foodRoute.js';
import 'dotenv/config';
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoute.js";

const port = process.env.PORT || 4000;

// App config
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://platterpal-qliz.onrender.com'  // Frontend origin
}));

// DB connection 
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
