"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewForm({ hostelId }: { hostelId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/hostels/${hostelId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      setComment("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Your rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this hostel…"
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        rows={2}
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-lg bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </form>
  );
}
