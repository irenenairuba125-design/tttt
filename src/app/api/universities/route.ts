import { NextResponse } from "next/server";
import { universities, hostels } from "@/lib/store";

export async function GET() {
  const withCounts = [...universities]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((u) => ({
      ...u,
      _count: { hostels: hostels.filter((h) => h.universityId === u.id && h.status === "approved").length },
    }));
  return NextResponse.json(withCounts);
}
