import Order from "../models/Order.js";


export const createOrder = async (req, res) => {
  try {
    const { customerName, phone, deliveryType, address, items, totalAmount, notes } = req.body;

    if (!customerName || !phone || !deliveryType || !items?.length || totalAmount === undefined) {
      return res.status(400).json({
        message: "customerName, phone, deliveryType, items, and totalAmount are required",
      });
    }

    if (deliveryType === "delivery" && !address) {
      return res.status(400).json({ message: "address is required for delivery orders" });
    }

    const order = await Order.create({
      customerName,
      phone,
      deliveryType,
      address: address || "",
      items,
      totalAmount,
      notes: notes || "",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// ── GET /api/orders ───────────────────────────────────────
// Get all orders, most recent first.
// Will be protected by admin auth later.
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// ── GET /api/orders/:id ───────────────────────────────────
// Get a single order by ID — useful for order tracking/confirmation.
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};