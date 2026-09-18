import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hostels, rooms, amenities, reviews, bookings, universities } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const hostel = hostels.find((h) => h.id === id);
  if (!hostel || hostel.status !== "approved") {
    return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
  }

  const session = await getSession();
  let caretakerPhone: string | null = null;

  if (session) {
    const unlockedBooking = bookings.find(
      (b) =>
        b.hostelId === id &&
        b.studentId === session.userId &&
        ["paid", "reserved", "checked_in"].includes(b.status)
    );
    if (unlockedBooking) caretakerPhone = hostel.caretakerPhone;
  }

  return NextResponse.json({
    ...hostel,
    caretakerPhone,
    rooms: rooms.filter((r) => r.hostelId === id),
    amenities: hostel.amenityIds.map((amenityId) => ({
      amenityId,
      amenity: amenities.find((a) => a.id === amenityId)!,
    })),
    reviews: reviews
      .filter((r) => r.hostelId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((r) => ({ ...r, student: { name: r.studentName } })),
    university: universities.find((u) => u.id === hostel.universityId),
  });
}
