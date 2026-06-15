"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../lib/api";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight,
  MapPin, Store, MessageCircle, CheckCircle2, AlertCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349033383479";
const ORDER_HISTORY_KEY = "chowdesk_order_history";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    deliveryType: "delivery", // "delivery" | "pickup"
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState(null);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ── VALIDATION ────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!form.phone.trim()) newErrors.phone = "Please enter your phone number";
    if (form.deliveryType === "delivery" && !form.address.trim()) {
      newErrors.address = "Please enter your delivery address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── BUILD WHATSAPP MESSAGE ─────────────────────────────
  const buildWhatsAppMessage = (reference) => {
    const lines = [];
    lines.push("🍽️ *New Order — ChowDesk*");
    lines.push(`*Order Ref:* #${reference}`);
    lines.push("");
    lines.push(`*Customer:* ${form.name}`);
    lines.push(`*Phone:* ${form.phone}`);
    lines.push(`*Order Type:* ${form.deliveryType === "delivery" ? "Delivery" : "Pickup"}`);
    if (form.deliveryType === "delivery") {
      lines.push(`*Address:* ${form.address}`);
    }
    lines.push("");
    lines.push("*Items:*");
    cart.forEach((item) => {
      lines.push(`• ${item.name}  x${item.quantity}  —  ${formatPrice(item.price * item.quantity)}`);
    });
    lines.push("");
    lines.push(`*Total: ${formatPrice(totalPrice)}*`);
    if (form.notes.trim()) {
      lines.push("");
      lines.push(`*Notes:* ${form.notes}`);
    }
    return lines.join("\n");
  };

  // ── SAVE ORDER ID TO LOCAL HISTORY ─────────────────────
  // Used by the Orders page to know which orders belong to this device.
  const saveToOrderHistory = (orderId) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]");
      const updated = [orderId, ...existing.filter((id) => id !== orderId)];
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable — order still placed, just won't show in history
    }
  };

  // ── SUBMIT ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const orderData = {
      customerName: form.name,
      phone: form.phone,
      deliveryType: form.deliveryType,
      address: form.deliveryType === "delivery" ? form.address : "",
      notes: form.notes,
      items: cart.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
    };

    try {
      const savedOrder = await placeOrder(orderData);
      const reference = savedOrder._id.slice(-6).toUpperCase();

      saveToOrderHistory(savedOrder._id);
      setOrderRef(reference);

      const message = encodeURIComponent(buildWhatsAppMessage(reference));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── ORDER PLACED — SUCCESS STATE ──────────────────────
  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="font-(family-name:--font-headline) text-2xl font-extrabold text-gray-900 mb-2">
          Order placed! 🎉
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 mb-2">
          Your order summary has opened in WhatsApp. Send the message to confirm —
          we'll start preparing your order right away.
        </p>
        {orderRef && (
          <p className="font-(family-name:--font-body) text-sm text-gray-400 mb-8">
            Order reference: <span className="font-bold text-(--color-primary)">#{orderRef}</span>
          </p>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
          >
            View Order History
          </Link>
          <Link
            href="/foodspage"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3 rounded-full border border-gray-200 transition-colors font-(family-name:--font-body)"
          >
            Order Something Else
          </Link>
        </div>
      </main>
    );
  }

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
          href="/foodspage"
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          Browse Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  // ── CART + CHECKOUT FORM ───────────────────────────────
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-(family-name:--font-headline) text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
            Your Cart
          </h1>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="font-(family-name:--font-body) text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Submit error banner */}
      {submitError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-(family-name:--font-body) text-sm font-medium">
              Couldn't place your order
            </p>
            <p className="font-(family-name:--font-body) text-xs mt-0.5 text-red-500">
              {submitError} — please check your connection and try again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: CART ITEMS + DETAILS FORM ──────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Cart items */}
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />

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

              <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 flex-shrink-0">
                <button
                  type="button"
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
                  type="button"
                  onClick={() => increaseQty(item._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item._id)}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Checkout details form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm mt-2">
            <h2 className="font-(family-name:--font-headline) text-lg font-extrabold text-gray-900 mb-4">
              Delivery Details
            </h2>

            <div className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ayeni Opeyemi"
                  className={`w-full px-4 py-3 rounded-xl border font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow
                    ${errors.name ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 font-(family-name:--font-body)">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0903 338 3479"
                  className={`w-full px-4 py-3 rounded-xl border font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow
                    ${errors.phone ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-(family-name:--font-body)">{errors.phone}</p>
                )}
              </div>

              {/* Delivery Type */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, deliveryType: "delivery" }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold font-(family-name:--font-body) transition-colors
                      ${form.deliveryType === "delivery"
                        ? "bg-(--color-primary)/10 border-(--color-primary) text-(--color-primary)"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <MapPin className="w-4 h-4" /> Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, deliveryType: "pickup" }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold font-(family-name:--font-body) transition-colors
                      ${form.deliveryType === "pickup"
                        ? "bg-(--color-primary)/10 border-(--color-primary) text-(--color-primary)"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <Store className="w-4 h-4" /> Pickup
                  </button>
                </div>
              </div>

              {/* Address — only for delivery */}
              {form.deliveryType === "delivery" && (
                <div>
                  <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your full delivery address"
                    className={`w-full px-4 py-3 rounded-xl border font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow resize-none
                      ${errors.address ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1 font-(family-name:--font-body)">{errors.address}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. extra spicy, no onions..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ORDER SUMMARY + PLACE ORDER ────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-(family-name:--font-headline) text-lg font-extrabold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm font-(family-name:--font-body)">
                  <span className="text-gray-500 truncate pr-2">
                    {item.name} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="text-gray-900 font-medium flex-shrink-0">
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
                Delivery fee discussed via WhatsApp
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) disabled:opacity-60 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Placing Order..." : "Place Order via WhatsApp"}
            </button>

            <Link
              href="/foodspage"
              className="w-full flex items-center justify-center mt-3 text-sm font-medium text-(--color-neutral) hover:text-(--color-primary) transition-colors font-(family-name:--font-body)"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </form>
    </main>
  );
}