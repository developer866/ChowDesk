"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Settings, Menu, X, UtensilsCrossed } from "lucide-react";
// import { useCart } from "../context/cartContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Foods", href: "/foodspage" },
  { label: "Orders", href: "/orders" },
  {label:"About Us", href:"/about"}
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-(--color-secondary)/30 shadow-sm sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-(--color-primary) rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="font-(family-name:--font-headline) text-sm font-extrabold tracking-widest uppercase text-(--color-neutral)">
            Chow<span className="text-(--color-primary)">Desk</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium font-(family-name:--font-body) rounded-lg transition-colors duration-150
                    ${isActive
                      ? "text-(--color-primary) after:absolute after:bottom-[-18px] after:left-4 after:right-4 after:h-[2.5px] after:bg-(--color-primary) after:rounded-t"
                      : "text-(--color-neutral) hover:text-(--color-primary) hover:bg-(--color-primary)/10"
                    }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1 flex-shrink-0">

          {/* Cart */}
          <Link
            href="/cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-(--color-neutral) hover:text-(--color-primary) hover:bg-(--color-primary)/10 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-(--color-primary) text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-(--color-neutral) hover:bg-(--color-primary)/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* ── MOBILE DRAWER ───────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-(--color-secondary)/20 bg-white px-4 pb-5 pt-3 flex flex-col gap-1 animate-slideDown">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-(family-name:--font-body) transition-colors
                  ${isActive
                    ? "bg-(--color-primary)/10 text-(--color-primary) font-semibold"
                    : "text-(--color-neutral) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                  }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Mobile cart row */}
          <div className="mt-2 border-t border-(--color-secondary)/20 pt-3">
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-(--color-primary)/10 border border-(--color-secondary)/30"
            >
              <span className="text-sm font-medium text-(--color-primary) flex items-center gap-2 font-(family-name:--font-body)">
                <ShoppingCart className="w-4 h-4" /> My Cart
              </span>
              <span className="text-xs font-bold bg-(--color-primary) text-white px-2.5 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </Link>
          </div>
        </div>
      )}

    </nav>
  );
}