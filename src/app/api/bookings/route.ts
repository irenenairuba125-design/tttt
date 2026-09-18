import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rooms, hostels, bookings, genId } from "@/lib/store";

const BOOKING_FEE = 50000;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "You must be logged in as a student to book" }, { status: 401 });
  }

  const { roomId } = await req.json();
  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  const room = rooms.find((r) => r.id === roomId);
  const hostel = room ? hostels.find((h) => h.id === room.hostelId) : undefined;

  if (!room || !hostel || hostel.status !== "approved") {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.bedsAvailable < 1 || room.status === "full") {
    return NextResponse.json({ error: "No beds available in this room" }, { status: 409 });
  }

  const booking = {
    id: genId("booking"),
    studentId: session.userId,
    roomId: room.id,
    hostelId: room.hostelId,
    bookingDate: new Date(),
    status: "pending" as const,
    bookingFeeAmount: BOOKING_FEE,
    reservedUntil: null,
  };
  bookings.push(booking);

  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mine = bookings
    .filter((b) => b.studentId === session.userId)
    .sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime())
    .map((b) => ({
      ...b,
      hostel: hostels.find((h) => h.id === b.hostelId),
      room: rooms.find((r) => r.id === b.roomId),
    }));

  return NextResponse.json(mine);
}
