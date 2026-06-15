import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── PUBLIC ───────────────────────────────────────────────
router.post("/", createOrder);        // POST   /api/orders        — place an order
router.get("/:id", getOrderById);     // GET    /api/orders/:id     — track a single order

// ── ADMIN ONLY ───────────────────────────────────────────
router.get("/", protect, getAllOrders);            // GET    /api/orders     — list all orders
router.patch("/:id", protect, updateOrderStatus);  // PATCH  /api/orders/:id — update status

export default router;