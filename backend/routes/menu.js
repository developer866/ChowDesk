import express from "express";
import {
  getAllMenuItems,
  getAllMenuItemsAdmin,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── ADMIN ONLY — placed before "/:id" for clarity ────────
router.get("/admin/all", protect, getAllMenuItemsAdmin); // GET /api/menu/admin/all — all items incl. unavailable

// ── PUBLIC ───────────────────────────────────────────────
router.get("/", getAllMenuItems);          // GET /api/menu?category=Mains
router.get("/:id", getMenuItemById);       // GET /api/menu/:id

// ── ADMIN ONLY ───────────────────────────────────────────
router.post("/", protect, createMenuItem);        // POST   /api/menu
router.patch("/:id", protect, updateMenuItem);     // PATCH  /api/menu/:id
router.delete("/:id", protect, deleteMenuItem);    // DELETE /api/menu/:id

export default router;