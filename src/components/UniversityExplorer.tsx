"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { HostelListItem } from "@/lib/types";

const HostelMap = dynamic(() => import("./HostelMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
      Loading map…
    </div>
  ),
});

type Filters = {
  type: "" | "girls_only" | "boys_only" | "mixed";
  roomType: "" | "single" | "double" | "triple";
  minPrice: string;
  maxPrice: string;
};

const TYPE_BADGE: Record<string, string> = {
  girls_only: "bg-pink-50 text-pink-700 ring-pink-200",
  boys_only: "bg-blue-50 text-blue-700 ring-blue-200",
  mixed: "bg-teal-50 text-teal-700 ring-teal-200",
};

const TYPE_LABEL: Record<string, string> = {
  girls_only: "Girls Only",
  boys_only: "Boys Only",
  mixed: "Mixed",
};

const TYPE_OPTIONS: { value: Filters["type"]; label: string }[] = [
  { value: "", label: "Any gender" },
  { value: "girls_only", label: "Girls Only" },
  { value: "boys_only", label: "Boys Only" },
  { value: "mixed", label: "Mixed" },
];

export default function UniversityExplorer({
  universityId,
  centerLat,
  centerLng,
}: {
  universityId: string;
  centerLat: number;
  centerLng: number;
}) {
  const [filters, setFilters] = useState<Filters>({
    type: "",
    roomType: "",
    minPrice: "",
    maxPrice: "",
  });
  const [hostels, setHostels] = useState<HostelListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams({ university_id: universityId });
    if (filters.type) params.set("type", filters.type);
    if (filters.roomType) params.set("room_type", filters.roomType);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    return params.toString();
  }, [universityId, filters]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hostels?${query}`)
      .then((r) => r.json())
      .then((data) => setHostels(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((f) => ({ ...f, type: opt.value }))}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filters.type === opt.value
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={filters.roomType}
            onChange={(e) =>
              setFilters((f) => ({ ...f, roomType: e.target.value as Filters["roomType"] }))
            }
          >
            <option value="">Any room type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>

          <input
            type="number"
            placeholder="Min UGX"
            className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Max UGX"
            className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-5">
        <HostelMap centerLat={centerLat} centerLng={centerLng} hostels={hostels} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        {!loading && hostels.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-500">
            No hostels match these filters yet.
          </p>
        )}
        {!loading &&
          hostels.map((h) => (
            <Link
              key={h.id}
              href={`/hostel/${h.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-200">
                {h.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.photos[0]}
                    alt={h.hostelName}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No photo</div>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TYPE_BADGE[h.type] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}
                >
                  {TYPE_LABEL[h.type] ?? h.type}
                </span>
              </div>
              <div className="p-4">
                <div className="font-semibold text-slate-900 group-hover:text-teal-700">{h.hostelName}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {h.distanceFromGateM ? `${h.distanceFromGateM}m from gate` : h.addressText}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  UGX {h.priceRangeMin.toLocaleString()} – {h.priceRangeMax.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-medium text-amber-600">
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 0 0-.363 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 0 0-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.363-1.118l-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
                    </svg>
                    {h.rating.toFixed(1)} ({h._count.reviews})
                  </span>
                  <span className="font-medium text-emerald-700">
                    {h.rooms.reduce((s, r) => s + r.bedsAvailable, 0)} beds free
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
