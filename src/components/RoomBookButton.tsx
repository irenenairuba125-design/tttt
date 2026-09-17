"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoomBookButton({
  roomId,
  disabled,
  isLoggedIn,
}: {
  roomId: string;
  disabled: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBook() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create booking");
      router.push(`/booking/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mt-3.5">
      <button
        onClick={handleBook}
        disabled={disabled || loading}
        className="w-full rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        {disabled ? "Full" : loading ? "Reserving…" : isLoggedIn ? "Book this room" : "Login to book"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
