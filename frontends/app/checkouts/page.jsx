"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { MapPin, Store, MessageCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349033383479";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    deliveryType: "delivery", // "delivery" | "pickup"
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  // ── BUILD WHATSAPP MESSAGE ────────────────────────────
  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push("🍽️ *New Order — ChowDesk*");
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

  // ── SUBMIT ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

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

    // ── Save order to backend (best-effort) ──────────────
    // If the backend isn't running yet, this fails silently
    // and the customer can still complete the order via WhatsApp.
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (API_URL) {
        await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      }
    } catch (err) {
      console.warn("Order could not be saved to backend (this is OK for now):", err.message);
    }

    // ── Open WhatsApp with the order summary ──────────────
    const message = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // ── Clear cart and show confirmation ──────────────────
    clearCart();
    setOrderPlaced(true);
    setSubmitting(false);
  };

  // ── ORDER PLACED — SUCCESS STATE ──────────────────────
  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="font-(family-name:--font-headline) text-2xl font-extrabold text-gray-900 mb-2">
          Order sent! 🎉
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 mb-8">
          Your order summary has opened in WhatsApp. Send the message to confirm —
          we'll start preparing your order right away.
        </p>
        <Link
          href="/foods"
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          Order Something Else
        </Link>
      </main>
    );
  }

  // ── EMPTY CART — REDIRECT GUARD ────────────────────────
  if (cart.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-(family-name:--font-headline) text-2xl font-extrabold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/foods"
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  // ── CHECKOUT FORM ──────────────────────────────────────
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Back link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-neutral) hover:text-(--color-primary) transition-colors font-(family-name:--font-body) mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="font-(family-name:--font-headline) text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
        Checkout
      </h1>
      <p className="font-(family-name:--font-body) text-gray-500 text-sm mb-8">
        Fill in your details — we'll send your order to us via WhatsApp.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── FORM ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-5">

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

          {/* Submit — desktop */}
          <button
            type="submit"
            disabled={submitting}
            className="hidden lg:flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) disabled:opacity-60 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors duration-200 font-(family-name:--font-body) mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            {submitting ? "Sending..." : "Send Order via WhatsApp"}
          </button>
        </form>

        {/* ── ORDER SUMMARY ────────────────────────────── */}
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
            </div>

            {/* Submit — mobile (sits with summary for visibility) */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) disabled:opacity-60 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Sending..." : "Send Order via WhatsApp"}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}