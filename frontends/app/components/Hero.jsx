"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* ── MOBILE LAYOUT (stacked) ────────────────── */}
      <div className="block md:hidden">

        {/* Food image on top for mobile */}
        <div
          className="w-full h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80')`,
          }}
        >
          {/* Slight bottom fade so text below reads cleanly */}
          <div className="w-full h-full bg-gradient-to-b from-transparent to-white/30" />
        </div>

        {/* Text content below image on mobile */}
        <div className="bg-white px-6 py-10">

          <div className="inline-flex items-center gap-2 bg-(--color-primary)/10 border border-(--color-primary)/20 text-(--color-primary) text-xs font-semibold px-3 py-1.5 rounded-full mb-5 font-(family-name:--font-body) uppercase tracking-wider">
            <UtensilsCrossed className="w-3 h-3" />
            Fresh · Fast · Delicious
          </div>

          <h1 className="font-(family-name:--font-headline) text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            Food with{" "}
            <span className="text-(--color-primary)">Chow Desk</span>
          </h1>

          <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed mb-7">
            Fresh meals, refreshing drinks, and fast delivery at your fingertips.
            Experience culinary excellence delivered directly to your door.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/foodspage"
              className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 shadow font-(family-name:--font-body)"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/foodspage"
              className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-full border border-gray-200 transition-colors font-(family-name:--font-body)"
            >
              View Menu
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8 border-t border-gray-100 pt-6">
            {[
              { value: "50+",   label: "Menu Items" },
              { value: "2k+",   label: "Customers" },
              { value: "30min", label: "Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-(family-name:--font-headline) text-xl font-extrabold text-(--color-primary)">
                  {stat.value}
                </p>
                <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── DESKTOP LAYOUT (side by side) ─────────── */}
      <div className="hidden md:flex min-h-[88vh] relative items-center">

        {/* Background image full width */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Gradient overlay — strong left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/5" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-10 py-24 w-full">
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 bg-(--color-primary)/10 border border-(--color-primary)/20 text-(--color-primary) text-xs font-semibold px-3 py-1.5 rounded-full mb-6 font-(family-name:--font-body) uppercase tracking-wider">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Fresh · Fast · Delicious
            </div>

            <h1 className="font-(family-name:--font-headline) text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Food with{" "}
              <span className="text-(--color-primary)">Chow Desk</span>
            </h1>

            <p className="font-(family-name:--font-body) text-lg text-gray-500 leading-relaxed mb-8 max-w-sm">
              Fresh meals, refreshing drinks, and fast delivery at your fingertips.
              Experience culinary excellence delivered directly to your door.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/foodspage"
                className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg font-(family-name:--font-body)"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/foodspage  "
                className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-7 py-3.5 rounded-full border border-gray-200 transition-colors shadow-sm font-(family-name:--font-body)"
              >
                View Menu
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12">
              {[
                { value: "50+",   label: "Menu Items" },
                { value: "2k+",   label: "Happy Customers" },
                { value: "30min", label: "Avg Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-(family-name:--font-headline) text-2xl font-extrabold text-(--color-primary)">
                    {stat.value}
                  </p>
                  <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}