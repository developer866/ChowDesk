"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, totalPrice, clearCart } = useCart();

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  // ── EMPTY CART STATE ──────────────────────────────────
  if (cart.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-(--color-primary)/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-9 h-9 text-(--color-primary)" />
        </div>
        <h1 className="font-(family-name:--font-headline) text-2xl font-extrabold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 mb-8">
          Looks like you haven't added anything yet. Browse our menu and find something delicious.
        </p>
        <Link
          href="/foods"
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          Browse Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  // ── CART WITH ITEMS ───────────────────────────────────
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-(family-name:--font-headline) text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
            Your Cart
          </h1>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="font-(family-name:--font-body) text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── CART ITEMS LIST ─────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-(family-name:--font-headline) text-sm sm:text-base font-bold text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="font-(family-name:--font-body) text-xs text-gray-400 mb-2">
                  {item.category}
                </p>
                <p className="font-(family-name:--font-headline) text-base font-extrabold text-(--color-primary)">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 flex-shrink-0">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-6 text-center font-(family-name:--font-body) text-sm font-semibold text-gray-900">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY ────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-(family-name:--font-headline) text-lg font-extrabold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm font-(family-name:--font-body)">
                  <span className="text-gray-500">
                    {item.name} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-(family-name:--font-headline) text-base font-bold text-gray-900">
                  Total
                </span>
                <span className="font-(family-name:--font-headline) text-xl font-extrabold text-(--color-primary)">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-1">
                Delivery fee calculated at checkout
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/foods"
              className="w-full flex items-center justify-center mt-3 text-sm font-medium text-(--color-neutral) hover:text-(--color-primary) transition-colors font-(family-name:--font-body)"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}