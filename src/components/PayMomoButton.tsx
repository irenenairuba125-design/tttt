"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PayMomoButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!phone) {
      setError("Enter the MTN MoMo number to pay from");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/momo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="text-sm font-medium text-slate-700">MTN MoMo number</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="07XXXXXXXX"
        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        {loading ? "Processing MoMo payment…" : "Pay booking fee via MTN MoMo"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
