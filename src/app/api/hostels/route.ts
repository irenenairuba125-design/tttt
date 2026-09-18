import { NextRequest, NextResponse } from "next/server";
import { hostels, rooms, amenities, reviews, type RoomType, type HostelType } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("university_id");
  const type = searchParams.get("type") as HostelType | null;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const roomType = searchParams.get("room_type") as RoomType | null;

  if (!universityId) {
    return NextResponse.json({ error: "university_id is required" }, { status: 400 });
  }

  let filtered = hostels.filter((h) => h.universityId === universityId && h.status === "approved");

  if (type) filtered = filtered.filter((h) => h.type === type);
  if (minPrice) filtered = filtered.filter((h) => h.priceRangeMin >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((h) => h.priceRangeMax <= Number(maxPrice));
  if (roomType) {
    filtered = filtered.filter((h) => rooms.some((r) => r.hostelId === h.id && r.roomType === roomType));
  }

  const result = filtered
    .sort((a, b) => b.rating - a.rating)
    .map((h) => ({
      ...h,
      caretakerPhone: undefined,
      rooms: rooms.filter((r) => r.hostelId === h.id),
      amenities: h.amenityIds.map((amenityId) => ({
        amenityId,
        amenity: amenities.find((a) => a.id === amenityId)!,
      })),
      _count: { reviews: reviews.filter((r) => r.hostelId === h.id).length },
    }));

  return NextResponse.json(result);
}
