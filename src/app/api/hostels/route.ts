import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("university_id");
  const type = searchParams.get("type");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const roomType = searchParams.get("room_type");

  if (!universityId) {
    return NextResponse.json({ error: "university_id is required" }, { status: 400 });
  }

  const where: Prisma.HostelWhereInput = {
    universityId,
    status: "approved",
  };

  if (type) where.type = type;

  if (minPrice || maxPrice) {
    where.priceRangeMin = minPrice ? { gte: Number(minPrice) } : undefined;
    where.priceRangeMax = maxPrice ? { lte: Number(maxPrice) } : undefined;
  }

  if (roomType) {
    where.rooms = { some: { roomType } };
  }

  const hostels = await prisma.hostel.findMany({
    where,
    include: {
      rooms: true,
      amenities: { include: { amenity: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { rating: "desc" },
  });

  const session = await getSession();
  if (session) {
    await prisma.searchLog.create({
      data: {
        studentId: session.role === "student" ? session.userId : null,
        universityId,
        filterType: JSON.stringify({ type, minPrice, maxPrice, roomType }),
      },
    });
  }

  const sanitized = hostels.map((h) => ({ ...h, caretakerPhone: undefined }));

  return NextResponse.json(sanitized);
}
