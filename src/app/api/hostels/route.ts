import { NextRequest, NextResponse } from "next/server";
import { Prisma, RoomType, HostelType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("university_id");
  const type = searchParams.get("type") as HostelType | null;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const roomType = searchParams.get("room_type") as RoomType | null;

  const where: Prisma.HostelWhereInput = { status: "approved" };
  if (universityId) where.universityId = universityId;
  if (type) where.type = type;
  // A hostel "matches" a price range if any part of its price range overlaps it,
  // so budget-conscious students still see hostels that have some rooms in range.
  if (minPrice) where.priceRangeMax = { gte: Number(minPrice) };
  if (maxPrice) where.priceRangeMin = { lte: Number(maxPrice) };
  if (roomType) where.rooms = { some: { roomType } };

  const hostels = await prisma.hostel.findMany({
    where,
    include: {
      rooms: true,
      amenities: { include: { amenity: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { rating: "desc" },
  });

  const result = hostels.map((h) => ({ ...h, caretakerPhone: undefined }));

  return NextResponse.json(result);
}
