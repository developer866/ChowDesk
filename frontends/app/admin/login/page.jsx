"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Lock, Mail, AlertCircle, Loader2, UtensilsCrossed } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-(--color-primary) rounded-xl flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-(family-name:--font-headline) text-xl font-extrabold text-gray-900">
            Chow<span className="text-(--color-primary)">Desk</span> Admin
          </h1>
          <p className="font-(family-name:--font-body) text-sm text-gray-500 mt-1">
            Sign in to manage orders and menu
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-(family-name:--font-body) text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@chowdesk.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-(family-name:--font-body) text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 font-(family-name:--font-body) text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 transition-shadow"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </main>
  );
}