"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", gender: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-lg font-bold text-white shadow-sm">
            H
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Book hostels near your campus in minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              placeholder="07XXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              className={inputClass}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:bg-slate-300"
          >
            {loading ? "Creating account…" : "Register"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-teal-700 hover:text-teal-800">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
