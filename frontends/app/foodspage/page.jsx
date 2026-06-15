"use client";

import { useState, useMemo, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import { getMenu } from "../lib/api";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Loader2 } from "lucide-react";

const categories = ["All", "Starters", "Mains", "Drinks", "Desserts"];

export default function FoodsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  // ── FETCH MENU FROM BACKEND ────────────────────────────
  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    getMenu()
      .then((data) => {
        if (isMounted) setMenuItems(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const handleAdd = (item) => {
    addToCart(item);
    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-(family-name:--font-headline) text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Our Menu
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
          Freshly prepared meals, drinks, and desserts — pick your favourites and order in seconds.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold font-(family-name:--font-body) transition-colors duration-200 border
              ${activeCategory === cat
                ? "bg-(--color-primary) text-white border-(--color-primary)"
                : "bg-white text-(--color-neutral) border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary)"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── LOADING STATE ────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-(--color-primary)" />
          <p className="font-(family-name:--font-body) text-sm">Loading menu...</p>
        </div>
      )}

      {/* ── ERROR STATE ──────────────────────────────── */}
      {!loading && error && (
        <div className="text-center py-20">
          <p className="font-(family-name:--font-body) text-red-500 text-sm mb-2">
            Couldn't load the menu.
          </p>
          <p className="font-(family-name:--font-body) text-gray-400 text-xs">
            Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      )}

      {/* ── MENU GRID ────────────────────────────────── */}
      {!loading && !error && (
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-(family-name:--font-body) text-gray-400">
              No items found in this category.
            </p>
          </div>
        )
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-(family-name:--font-body) z-50">
          <ShoppingCart className="w-4 h-4 text-(--color-primary)" />
          {toast}
        </div>
      )}

    </main>
  );
}