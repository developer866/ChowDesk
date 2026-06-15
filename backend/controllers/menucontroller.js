import MenuItem from "../models/MenuItem.js";

// ── GET /api/menu ────────────────────────────────────────
// Public — only returns AVAILABLE items. Supports ?category= filter.
export const getAllMenuItems = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isAvailable: true };
    if (category && category !== "All") {
      filter.category = category;
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items", error: err.message });
  }
};

// ── GET /api/menu/admin/all ───────────────────────────────
// Admin only — returns ALL items, including unavailable ones,
// so the admin can toggle availability back on.
export const getAllMenuItemsAdmin = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items", error: err.message });
  }
};

// ── GET /api/menu/:id ────────────────────────────────────
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu item", error: err.message });
  }
};

// ── POST /api/menu ─────────────────────────────────────────
// Admin only
export const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, isAvailable } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "name, category, and price are required" });
    }

    const item = await MenuItem.create({
      name,
      category,
      price,
      description,
      imageUrl,
      isAvailable: isAvailable ?? true,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create menu item", error: err.message });
  }
};

// ── PATCH /api/menu/:id ────────────────────────────────────
// Admin only
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update menu item", error: err.message });
  }
};

// ── DELETE /api/menu/:id ───────────────────────────────────
// Admin only
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete menu item", error: err.message });
  }
};