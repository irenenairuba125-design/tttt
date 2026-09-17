import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hostel: true },
  });

  if (!room || room.hostel.status !== "approved") {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.bedsAvailable < 1 || room.status === "full") {
    return NextResponse.json({ error: "No beds available in this room" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      studentId: session.userId,
      roomId: room.id,
      hostelId: room.hostelId,
      status: "pending",
      bookingFeeAmount: BOOKING_FEE,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.userId },
    include: { hostel: true, room: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
