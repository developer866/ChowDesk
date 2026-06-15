"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrder } from "../lib/api";
import {
  ChevronDown, ChevronUp, ClipboardList, Loader2,
  Package, MapPin, Store, Clock,
} from "lucide-react";

const ORDER_HISTORY_KEY = "chowdesk_order_history";

const statusStyles = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── LOAD ORDER HISTORY FROM LOCALSTORAGE + BACKEND ────
  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      let orderIds = [];
      try {
        orderIds = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]");
      } catch {
        orderIds = [];
      }

      if (orderIds.length === 0) {
        if (isMounted) {
          setOrders([]);
          setLoading(false);
        }
        return;
      }

      try {
        // Fetch each order by ID. If one fails (e.g. deleted), skip it.
        const results = await Promise.all(
          orderIds.map((id) =>
            getOrder(id).catch(() => null)
          )
        );

        const validOrders = results.filter(Boolean);

        if (isMounted) setOrders(validOrders);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();
    return () => { isMounted = false; };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── EMPTY STATE ────────────────────────────────────────
  if (!loading && !error && orders.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-(--color-primary)/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-9 h-9 text-(--color-primary)" />
        </div>
        <h1 className="font-(family-name:--font-headline) text-2xl font-extrabold text-gray-900 mb-2">
          No orders yet
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 mb-8">
          Your order history will appear here once you place an order on this device.
        </p>
        <Link
          href="/foodspage"
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-(family-name:--font-headline) text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
          Order History
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 text-sm">
          Orders placed from this device.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-(--color-primary)" />
          <p className="font-(family-name:--font-body) text-sm">Loading your orders...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <p className="font-(family-name:--font-body) text-red-500 text-sm mb-2">
            Couldn't load your orders.
          </p>
          <p className="font-(family-name:--font-body) text-gray-400 text-xs">
            Make sure the backend server is running.
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            const reference = order._id.slice(-6).toUpperCase();

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Summary row — click to expand */}
                <button
                  type="button"
                  onClick={() => toggleExpand(order._id)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-(--color-primary)" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-(family-name:--font-headline) text-sm sm:text-base font-bold text-gray-900">
                          Order #{reference}
                        </p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-(family-name:--font-body) ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="font-(family-name:--font-body) text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-(family-name:--font-headline) text-base sm:text-lg font-extrabold text-(--color-primary)">
                      {formatPrice(order.totalAmount)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50">

                    {/* Delivery info */}
                    <div className="flex items-center gap-2 mb-4 font-(family-name:--font-body) text-sm text-gray-600">
                      {order.deliveryType === "delivery" ? (
                        <>
                          <MapPin className="w-4 h-4 text-(--color-primary)" />
                          <span>Delivery — {order.address}</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4 text-(--color-primary)" />
                          <span>Pickup</span>
                        </>
                      )}
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm font-(family-name:--font-body)"
                        >
                          <span className="text-gray-600">
                            {item.name} <span className="text-gray-400">× {item.quantity}</span>
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <p className="font-(family-name:--font-body) text-xs text-gray-500 italic mb-4">
                        Note: {order.notes}
                      </p>
                    )}

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                      <span className="font-(family-name:--font-headline) text-sm font-bold text-gray-900">
                        Total
                      </span>
                      <span className="font-(family-name:--font-headline) text-base font-extrabold text-(--color-primary)">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </main>
  );
}