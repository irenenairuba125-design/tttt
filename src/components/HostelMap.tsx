"use client";

import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import type { HostelListItem } from "@/lib/types";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TYPE_COLORS: Record<string, string> = {
  girls_only: "#ec4899",
  boys_only: "#3b82f6",
  mixed: "#10b981",
};

export default function HostelMap({
  centerLat,
  centerLng,
  hostels,
}: {
  centerLat: number;
  centerLng: number;
  hostels: HostelListItem[];
}) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-[500] flex gap-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLORS.girls_only }} />
          Girls
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLORS.boys_only }} />
          Boys
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLORS.mixed }} />
          Mixed
        </span>
      </div>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={15}
        scrollWheelZoom
        className="h-[420px] w-full rounded-2xl border border-slate-200"
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[centerLat, centerLng]}
        radius={10}
        pathOptions={{ color: "#111827", fillColor: "#111827", fillOpacity: 1 }}
      >
        <Popup>University main gate</Popup>
      </CircleMarker>

      {hostels.map((h) => (
        <CircleMarker
          key={h.id}
          center={[h.locationLat, h.locationLng]}
          radius={9}
          pathOptions={{
            color: TYPE_COLORS[h.type] ?? "#6366f1",
            fillColor: TYPE_COLORS[h.type] ?? "#6366f1",
            fillOpacity: 0.85,
          }}
        >
          <Popup>
            <div className="font-semibold">{h.hostelName}</div>
            <div className="text-xs text-zinc-500">
              {h.distanceFromGateM ? `${h.distanceFromGateM}m from gate` : ""}
            </div>
            <div className="text-xs">
              UGX {h.priceRangeMin.toLocaleString()} - {h.priceRangeMax.toLocaleString()}
            </div>
            <Link href={`/hostel/${h.id}`} className="text-emerald-700 underline text-sm">
              View hostel
            </Link>
          </Popup>
        </CircleMarker>
      ))}
      </MapContainer>
    </div>
  );
}
