import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bookings, hostels, rooms, payments } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = bookings.find((b) => b.id === id);

  if (!booking || booking.studentId !== session.userId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const hostel = hostels.find((h) => h.id === booking.hostelId)!;
  const room = rooms.find((r) => r.id === booking.roomId)!;
  const unlocked = ["paid", "reserved", "checked_in"].includes(booking.status);

  return NextResponse.json({
    ...booking,
    hostel: { ...hostel, caretakerPhone: unlocked ? hostel.caretakerPhone : null },
    room,
    payments: payments.filter((p) => p.bookingId === booking.id),
  });
}
