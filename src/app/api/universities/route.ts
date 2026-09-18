import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { hostels: { where: { status: "approved" } } } } },
  });
  return NextResponse.json(universities);
}
