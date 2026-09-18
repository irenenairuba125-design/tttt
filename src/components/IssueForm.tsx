"use client";

import { useState } from "react";

export default function IssueForm({ hostelId }: { hostelId: string }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/hostels/${hostelId}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit report");
      setDescription("");
      setSent(true);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <p className="mt-2 text-sm font-medium text-emerald-700">
        Thanks — your report has been sent to the hostel owner.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H9Zm0 0h.01v4H9V9Z" clipRule="evenodd" />
        </svg>
        Report an issue with this hostel
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue (e.g. broken water supply, safety concern, misleading listing)…"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
        rows={3}
        required
      />
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-slate-300"
        >
          {submitting ? "Sending…" : "Send report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </form>
  );
}
