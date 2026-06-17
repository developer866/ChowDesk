"use client";

import { useEffect, useState, useRef } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  getAllMenuItemsAdmin, createMenuItem, updateMenuItem,
  deleteMenuItem, uploadImage,
} from "../../lib/adminApi";
import {
  Loader2, Plus, Pencil, Trash2, X, Eye, EyeOff, ImageOff, Upload,
} from "lucide-react";

const categories = ["Starters", "Mains", "Drinks", "Desserts"];

const emptyForm = {
  name: "",
  category: "Mains",
  price: "",
  description: "",
  imageUrl: "",
  isAvailable: true,
};

export default function AdminMenuPage() {
  const { token } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  // ── FETCH ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllMenuItemsAdmin(token)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // ── FORM HANDLERS ──────────────────────────────────────
  const openAddForm = () => {
    setForm(emptyForm);
    setFormError(null);
    setImageFile(null);
    setImagePreview(null);
    setEditingItem("new");
  };

  const openEditForm = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
    });
    setFormError(null);
    setImageFile(null);
    setImagePreview(item.imageUrl || null);
    setEditingItem(item);
  };

  const closeForm = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormError(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── IMAGE PICK ─────────────────────────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── SUBMIT ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.category || form.price === "") {
      setFormError("Name, category, and price are required.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      // If user picked a new image — upload it first
      if (imageFile) {
        setUploading(true);
        const result = await uploadImage(imageFile, token);
        imageUrl = result.url;
        setUploading(false);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        imageUrl,
        isAvailable: form.isAvailable,
      };

      if (editingItem === "new") {
        const created = await createMenuItem(payload, token);
        setItems((prev) => [created, ...prev]);
      } else {
        const updated = await updateMenuItem(editingItem._id, payload, token);
        setItems((prev) =>
          prev.map((i) => (i._id === updated._id ? updated : i))
        );
      }
      closeForm();
    } catch (err) {
      setUploading(false);
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    setDeletingId(item._id);
    try {
      await deleteMenuItem(item._id, token);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // ── TOGGLE AVAILABILITY ────────────────────────────────
  const toggleAvailability = async (item) => {
    try {
      const updated = await updateMenuItem(item._id, { isAvailable: !item.isAvailable }, token);
      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  };

  return (
    <main className="px-6 sm:px-8 py-8 max-w-5xl">

      {/* Heading */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            Menu Management
          </h1>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm">
            Add, edit, or remove items from your menu.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* ── FORM ────────────────────────────────────────── */}
      {editingItem && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-(family-name:--font-headline) text-lg font-extrabold text-gray-900">
              {editingItem === "new" ? "Add New Item" : `Edit "${editingItem.name}"`}
            </h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-(family-name:--font-body) rounded-xl px-4 py-2.5 mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Image upload */}
            <div>
              <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                Item Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-(--color-primary) transition-colors cursor-pointer overflow-hidden bg-gray-50 flex flex-col items-center justify-center gap-2"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="font-(family-name:--font-body) text-white text-sm font-medium">
                        Click to change
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-gray-300" />
                    <p className="font-(family-name:--font-body) text-sm text-gray-400">
                      Click to upload image
                    </p>
                    <p className="font-(family-name:--font-body) text-xs text-gray-300">
                      JPG, PNG, WebP · max 5MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImagePick}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jollof Rice & Grilled Chicken"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                  Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 4500"
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Short description of the dish..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 resize-none"
              />
            </div>

            {/* Available toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="font-(family-name:--font-body) text-sm text-gray-700">
                Available for ordering
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center gap-3 mt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors font-(family-name:--font-body)"
              >
                {(submitting || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {uploading ? "Uploading image..." : submitting ? "Saving..." : editingItem === "new" ? "Add Item" : "Save Changes"}
              </button>
              <button type="button" onClick={closeForm} className="text-sm font-medium text-gray-500 hover:text-gray-700 font-(family-name:--font-body)">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading / Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-(--color-primary)" />
          <p className="font-(family-name:--font-body) text-sm text-gray-400">Loading menu...</p>
        </div>
      )}
      {!loading && error && (
        <p className="text-center py-20 font-(family-name:--font-body) text-red-500 text-sm">
          Couldn't load menu items. {error}
        </p>
      )}

      {/* Items grid */}
      {!loading && !error && (
        items.length === 0 ? (
          <p className="text-center py-20 font-(family-name:--font-body) text-gray-400 text-sm">
            No menu items yet. Click "Add Item" to create your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden
                  ${item.isAvailable ? "border-gray-100" : "border-gray-100 opacity-60"}`}
              >
                <div className="relative w-full h-32 bg-gray-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageOff className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 text-xs font-semibold text-(--color-neutral) px-2 py-0.5 rounded-full font-(family-name:--font-body)">
                    {item.category}
                  </span>
                  {!item.isAvailable && (
                    <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs font-semibold px-2 py-0.5 rounded-full font-(family-name:--font-body)">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-(family-name:--font-headline) text-sm font-bold text-gray-900 truncate mb-0.5">
                    {item.name}
                  </h3>
                  <p className="font-(family-name:--font-headline) text-base font-extrabold text-(--color-primary) mb-3">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors font-(family-name:--font-body)"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(item)}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                      title={item.isAvailable ? "Hide from menu" : "Show on menu"}
                    >
                      {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item._id}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </main>
  );
}