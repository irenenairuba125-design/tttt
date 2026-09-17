import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hostels = await prisma.hostel.findMany({
    where: { status: "pending" },
    include: { owner: { select: { name: true, phone: true } }, university: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(hostels);
}
