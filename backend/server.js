import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import menuRoutes from "./routes/menu.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  
connectDB();

app.use(cors());
app.use(express.json());    

app.get("/", (req, res) => {
  res.send("Welcome to the ChowDesk API!");
});

app.use("/api/menu", menuRoutes);  // Menu routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
