import { NextRequest, NextResponse } from "next/server";
import { hostels, rooms, amenities, reviews, type RoomType, type HostelType } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("university_id");
  const type = searchParams.get("type") as HostelType | null;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const roomType = searchParams.get("room_type") as RoomType | null;

  let filtered = hostels.filter((h) => h.status === "approved");
  if (universityId) filtered = filtered.filter((h) => h.universityId === universityId);

  if (type) filtered = filtered.filter((h) => h.type === type);
  // A hostel "matches" a price cap if any part of its price range falls at or below it,
  // so budget-conscious students still see hostels that have some rooms in range.
  if (minPrice) filtered = filtered.filter((h) => h.priceRangeMax >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((h) => h.priceRangeMin <= Number(maxPrice));
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
