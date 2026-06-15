"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { AdminAuthProvider, useAdminAuth } from "../context/AdminAuthContext";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, LogOut, Loader2 } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",    icon: ClipboardList },
  { label: "Menu",      href: "/admin/menu",      icon: UtensilsCrossed },
];

function AdminGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, admin, logout } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated (except on login page itself)
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  // Redirect to dashboard if already logged in and on login page
  useEffect(() => {
    if (!loading && isAuthenticated && isLoginPage) {
      router.push("/admin/dashboard");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  // ── Login page — no sidebar, render directly ──────────────
  if (isLoginPage) {
    return children;
  }

  // ── Loading auth state ────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-(--color-primary)" />
      </div>
    );
  }

  // ── Not authenticated — show nothing while redirecting ────
  if (!isAuthenticated) {
    return null;
  }

  // ── Authenticated — show admin layout with sidebar ────────
  return (
    <div className="flex min-h-[80vh]">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <p className="font-(family-name:--font-headline) text-sm font-extrabold text-gray-900">
            Chow<span className="text-(--color-primary)">Desk</span>
          </p>
          <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-0.5">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-(family-name:--font-body) transition-colors
                  ${isActive
                    ? "bg-(--color-primary)/10 text-(--color-primary)"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="font-(family-name:--font-body) text-xs text-gray-400">Signed in as</p>
            <p className="font-(family-name:--font-body) text-sm font-medium text-gray-700 truncate">
              {admin?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-(family-name:--font-body) text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2 z-40">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-medium font-(family-name:--font-body)
                ${isActive ? "text-(--color-primary)" : "text-gray-400"}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-medium font-(family-name:--font-body) text-gray-400"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Page content */}
      <div className="flex-1 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}