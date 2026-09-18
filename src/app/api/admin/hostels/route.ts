import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hostels, universities } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = hostels
    .filter((h) => h.status === "pending")
    .map((h) => ({ ...h, university: universities.find((u) => u.id === h.universityId) }));

  return NextResponse.json(pending);
}
