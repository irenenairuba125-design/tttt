import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hostels } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hostel = hostels.find((h) => h.id === id);
  if (!hostel) {
    return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
  }

  hostel.status = "approved";
  return NextResponse.json(hostel);
}
