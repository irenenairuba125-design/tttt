"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { HostelListItem } from "@/lib/types";

type UniversityOption = {
  id: string;
  name: string;
  district: string;
  _count: { hostels: number };
};

type TypeFilter = "" | "girls_only" | "boys_only" | "mixed";
type PriceBucket = "" | "under_200k" | "200k_400k" | "400k_600k" | "over_600k";
type SortBy = "rating" | "price_asc" | "price_desc";

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

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "", label: "Any gender" },
  { value: "girls_only", label: "Girls Only" },
  { value: "boys_only", label: "Boys Only" },
  { value: "mixed", label: "Mixed" },
];

const PRICE_OPTIONS: { value: PriceBucket; label: string; min?: number; max?: number }[] = [
  { value: "", label: "Any price" },
  { value: "under_200k", label: "Under 200K", max: 200_000 },
  { value: "200k_400k", label: "200K – 400K", min: 200_000, max: 400_000 },
  { value: "400k_600k", label: "400K – 600K", min: 400_000, max: 600_000 },
  { value: "over_600k", label: "600K+", min: 600_000 },
];

export default function BrowseHostels() {
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [universityId, setUniversityId] = useState<string>("");
  const [type, setType] = useState<TypeFilter>("");
  const [priceBucket, setPriceBucket] = useState<PriceBucket>("");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [hostels, setHostels] = useState<HostelListItem[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/universities")
      .then((r) => r.json())
      .then((data) => setUniversities(Array.isArray(data) ? data : []));
  }, []);

  const priceOption = PRICE_OPTIONS.find((p) => p.value === priceBucket)!;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (universityId) params.set("university_id", universityId);
    if (type) params.set("type", type);
    if (priceOption.min) params.set("min_price", String(priceOption.min));
    if (priceOption.max) params.set("max_price", String(priceOption.max));
    return params.toString();
  }, [universityId, type, priceOption]);

  const loading = loadedQuery !== query;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/hostels?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setHostels(Array.isArray(data) ? data : []);
        setLoadedQuery(query);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const sortedHostels = useMemo(() => {
    const list = [...hostels];
    if (sortBy === "price_asc") list.sort((a, b) => a.priceRangeMin - b.priceRangeMin);
    else if (sortBy === "price_desc") list.sort((a, b) => b.priceRangeMax - a.priceRangeMax);
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [hostels, sortBy]);

  const universityName = (id: string) => universities.find((u) => u.id === id)?.name;

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            University
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setUniversityId("")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                universityId === ""
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All universities
            </button>
            {universities.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setUniversityId(uni.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  universityId === uni.id
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {uni.name}
                <span className="ml-1.5 opacity-70">({uni._count.hostels})</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Gender
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  type === opt.value
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Price per semester (UGX)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceBucket(opt.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    priceBucket === opt.value
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Sort by
            </label>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
            >
              <option value="rating">Top rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        {!loading && (
          <>
            {sortedHostels.length} hostel{sortedHostels.length === 1 ? "" : "s"} found
            {universityId ? ` near ${universityName(universityId)}` : ""}
          </>
        )}
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        {!loading && sortedHostels.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-500">
            No hostels match these filters yet. Try widening your price range.
          </p>
        )}
        {!loading &&
          sortedHostels.map((h) => (
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
                  {!universityId && universityName(h.universityId)
                    ? `${universityName(h.universityId)} · ${h.distanceFromGateM ? `${h.distanceFromGateM}m from gate` : "nearby"}`
                    : h.distanceFromGateM
                      ? `${h.distanceFromGateM}m from gate`
                      : h.addressText}
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
