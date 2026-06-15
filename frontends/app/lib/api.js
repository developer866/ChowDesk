const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── GET /api/menu ─────────────────────────────────────────
// Fetch all menu items. Optionally filter by category.
export async function getMenu(category) {
  const url = category && category !== "All"
    ? `${API_URL}/api/menu?category=${encodeURIComponent(category)}`
    : `${API_URL}/api/menu`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }

  return res.json();
}

// ── GET /api/menu/:id ─────────────────────────────────────
export async function getMenuItem(id) {
  const res = await fetch(`${API_URL}/api/menu/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch menu item");
  }

  return res.json();
}

// ── POST /api/orders ───────────────────────────────────────
// Place a new order. Returns the saved order (including _id)
// on success — used to generate an order reference number.
export async function placeOrder(orderData) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to place order");
  }

  return res.json();
}

// ── GET /api/orders/:id ─────────────────────────────────────
// Fetch a single order — useful for order tracking later.
export async function getOrder(id) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}