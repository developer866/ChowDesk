const express = require("express");
const router = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// ── PUBLIC ROUTES ────────────────────────────────────────
router.get("/", getAllMenuItems);          // GET /api/menu?category=Mains
router.get("/:id", getMenuItemById);       // GET /api/menu/:id

// ── ADMIN ROUTES (auth middleware to be added later) ─────
// When auth is ready, import authMiddleware and add it like:
//   router.post("/", authMiddleware, createMenuItem);
router.post("/", createMenuItem);          // POST   /api/menu
router.patch("/:id", updateMenuItem);      // PATCH  /api/menu/:id
router.delete("/:id", deleteMenuItem);     // DELETE /api/menu/:id

module.exports = router;