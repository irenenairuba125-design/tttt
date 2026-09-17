"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-lg font-bold text-white shadow-sm">
            H
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Login to manage your bookings.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="07XXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:bg-slate-300"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          No account?{" "}
          <a href="/register" className="font-medium text-teal-700 hover:text-teal-800">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
