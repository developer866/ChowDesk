"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAllOrders } from "../../lib/adminApi";
import {
  ClipboardList, Wallet, Calendar, Clock, Loader2,
  TrendingUp, ArrowRight,
} from "lucide-react";

const statusStyles = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboardPage() {
  const { token, admin } = useAdminAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── FETCH ALL ORDERS ────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getAllOrders(token)
      .then((data) => {
        if (isMounted) setOrders(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);

  // ── COMPUTE STATS ────────────────────────────────────────
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingCount = orders.filter((o) => o.status === "Pending").length;

    return {
      totalOrders,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingCount,
    };
  }, [orders]);

  // ── TOP SELLING ITEMS ─────────────────────────────────────
  const topItems = useMemo(() => {
    const itemMap = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // ── RECENT ORDERS (already sorted by backend, newest first) ─
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ClipboardList, color: "text-(--color-primary)" },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: Wallet, color: "text-green-600" },
    { label: "Orders Today", value: stats.todayOrders, icon: Calendar, color: "text-blue-600" },
    { label: "Revenue Today", value: formatPrice(stats.todayRevenue), icon: TrendingUp, color: "text-purple-600" },
    { label: "Pending Orders", value: stats.pendingCount, icon: Clock, color: "text-yellow-600" },
  ];

  return (
    <main className="px-6 sm:px-8 py-8 max-w-6xl">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Welcome back{admin?.name ? `, ${admin.name}` : ""} 👋
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 text-sm">
          Here's what's happening with ChowDesk today.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-(--color-primary)" />
          <p className="font-(family-name:--font-body) text-sm">Loading dashboard...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <p className="font-(family-name:--font-body) text-red-500 text-sm">
            Couldn't load dashboard data. {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mb-3 ${stat.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-(family-name:--font-headline) text-xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-(family-name:--font-headline) text-base font-bold text-gray-900">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-(--color-primary) hover:text-(--color-secondary) transition-colors font-(family-name:--font-body)"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-(family-name:--font-body) text-sm text-gray-400">
                    No orders yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
                      <div className="min-w-0">
                        <p className="font-(family-name:--font-body) text-sm font-semibold text-gray-900 truncate">
                          {order.customerName}
                        </p>
                        <p className="font-(family-name:--font-body) text-xs text-gray-400 mt-0.5">
                          #{order._id.slice(-6).toUpperCase()} · {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-(family-name:--font-body) ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                          {order.status}
                        </span>
                        <span className="font-(family-name:--font-headline) text-sm font-extrabold text-(--color-primary)">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Selling Items */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-(family-name:--font-headline) text-base font-bold text-gray-900">
                  Top Selling Items
                </h2>
              </div>

              {topItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-(family-name:--font-body) text-sm text-gray-400">
                    No sales data yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {topItems.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-3 p-4">
                      <span className="w-6 h-6 rounded-full bg-(--color-primary)/10 text-(--color-primary) text-xs font-bold flex items-center justify-center flex-shrink-0 font-(family-name:--font-body)">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-(family-name:--font-body) text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="font-(family-name:--font-body) text-xs text-gray-400">
                          {item.quantity} sold · {formatPrice(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

    </main>
  );
}