"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAllOrders, updateOrderStatus } from "../../lib/adminApi";
import {
  Loader2, ChevronDown, ChevronUp, MapPin, Store, Clock, Package,
} from "lucide-react";

const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

const statusStyles = {
  Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const filterTabs = ["All", ...statusOptions];

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

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

  // ── FETCH ORDERS ───────────────────────────────────────
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

  // ── FILTERED ORDERS ────────────────────────────────────
  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── UPDATE STATUS ──────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="px-6 sm:px-8 py-8 max-w-5xl">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Orders
        </h1>
        <p className="font-(family-name:--font-body) text-gray-500 text-sm">
          Manage and update order statuses.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold font-(family-name:--font-body) transition-colors duration-200 border
              ${activeFilter === tab
                ? "bg-(--color-primary) text-white border-(--color-primary)"
                : "bg-white text-(--color-neutral) border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary)"
              }`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-(--color-primary)" />
          <p className="font-(family-name:--font-body) text-sm">Loading orders...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <p className="font-(family-name:--font-body) text-red-500 text-sm">
            Couldn't load orders. {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-20">
          <p className="font-(family-name:--font-body) text-gray-400 text-sm">
            No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} orders found.
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order._id;
            const reference = order._id.slice(-6).toUpperCase();

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Summary row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5">

                  {/* Left: order info — click to expand */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(order._id)}
                    className="flex items-center gap-4 min-w-0 text-left flex-1"
                  >
                    <div className="w-11 h-11 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-(--color-primary)" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-(family-name:--font-headline) text-sm sm:text-base font-bold text-gray-900">
                        #{reference} — {order.customerName}
                      </p>
                      <p className="font-(family-name:--font-body) text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatDate(order.createdAt)} · {order.phone}
                      </p>
                    </div>
                  </button>

                  {/* Right: total + status select */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-(family-name:--font-headline) text-base font-extrabold text-(--color-primary)">
                      {formatPrice(order.totalAmount)}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border font-(family-name:--font-body) cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-opacity
                        ${statusStyles[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}
                        ${updatingId === order._id ? "opacity-50" : ""}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => toggleExpand(order._id)}
                      className="text-gray-400"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

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