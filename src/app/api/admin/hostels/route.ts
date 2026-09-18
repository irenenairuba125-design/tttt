import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await prisma.hostel.findMany({
    where: { status: "pending" },
    include: { owner: { select: { name: true, phone: true } }, university: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(pending);
}
