import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hostel = await prisma.hostel.findUnique({ where: { id } });
  if (!hostel) {
    return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
  }

  const updated = await prisma.hostel.update({ where: { id }, data: { status: "rejected" } });
  return NextResponse.json(updated);
}
