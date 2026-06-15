import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { requestLogger } from "./middleware/logger.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";   // ← new

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Welcome to the ChowDesk API!");
});

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);   // ← new

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});