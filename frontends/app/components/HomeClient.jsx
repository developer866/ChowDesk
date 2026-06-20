"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
// import Hero from "../components/Hero";
import Hero from "./Hero";
import MenuCard from "./MenuCard";
import { menuItems } from "../lib/menu";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  MessageCircle,
  Truck,
  Leaf,
  Clock,
  ArrowRight,
} from "lucide-react";

// Pick a few standout items to feature on the homepage
const featuredIds = ["4", "6", "9", "11"];
const featuredItems = menuItems.filter((item) =>
  featuredIds.includes(item._id),
);


const categoryCards = [
  {
    name: "Starters",
    image:
      "https://images.unsplash.com/photo-1544601425-9f2a3e2c4b58?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Mains",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80",
  },
];

const steps = [
  {
    icon: ShoppingCart,
    title: "Browse the Menu",
    desc: "Explore our full menu of starters, mains, drinks, and desserts.",
  },
  {
    icon: MessageCircle,
    title: "Order via WhatsApp",
    desc: "Add items to your cart and send your order straight to us on WhatsApp.",
  },
  {
    icon: Truck,
    title: "Enjoy Your Meal",
    desc: "Sit back and relax — we'll have your order ready for pickup or delivery.",
  },
];

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Every dish is prepared with fresh, locally-sourced ingredients.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    desc: "Average delivery time of 30 minutes across the city.",
  },
  {
    icon: MessageCircle,
    title: "Easy Ordering",
    desc: "No app downloads — order directly through WhatsApp in seconds.",
  },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);

  const handleAdd = (item) => {
    addToCart(item);
    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <main>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Explore Our Categories
          </h2>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
            From hearty mains to refreshing drinks — find exactly what youre
            craving.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              href="/foodspage"
              className="group relative h-32 sm:h-40 rounded-2xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                <span className="font-(family-name:--font-headline) text-white text-base sm:text-lg font-bold">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED MENU ─────────────────────────────── */}
      <section className="bg-(--color-primary)/5 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Popular Picks
              </h2>
              <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
                Customer favourites — handpicked just for you.
              </p>
            </div>
            <Link
              href="/foodspage"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) hover:text-(--color-secondary) transition-colors font-(family-name:--font-body)"
            >
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
            Ordering with ChowDesk takes less than a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="w-16 h-16 bg-(--color-primary)/10 rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 text-(--color-primary)" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-(--color-primary) text-white text-xs font-bold rounded-full flex items-center justify-center font-(family-name:--font-body)">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-(family-name:--font-headline) text-base font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Why Choose ChowDesk
            </h2>
            <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
              We make great food simple, fast, and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-12 h-12 bg-(--color-primary)/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-(--color-primary)" />
                  </div>
                  <h3 className="font-(family-name:--font-headline) text-base font-bold text-gray-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-(--color-primary) rounded-3xl px-8 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />

          <div className="relative z-10">
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Hungry? Lets Fix That.
            </h2>
            <p className="font-(family-name:--font-body) text-white/90 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Browse our menu and place your order in seconds — delivered hot
              and fresh to your door.
            </p>
            <Link
              href="/foodspage"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-(--color-primary) font-semibold text-sm px-7 py-3.5 rounded-full transition-colors duration-200 shadow-md font-(family-name:--font-body)"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOAST ─────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-(family-name:--font-body) z-50">
          <ShoppingCart className="w-4 h-4 text-(--color-primary)" />
          {toast}
        </div>
      )}
    </main>
  );
}
