import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bookings, rooms, payments, genId } from "@/lib/store";

const RESERVATION_HOURS = 48;

/**
 * Stub for MTN MoMo Collections API. Simulates an immediate successful
 * payment so the booking flow can be demoed end-to-end without live
 * MoMo sandbox credentials. Swap this handler's body for a real MoMo
 * request/callback flow when credentials are available.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, phone } = await req.json();
  if (!bookingId || !phone) {
    return NextResponse.json({ error: "bookingId and phone are required" }, { status: 400 });
  }

  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking || booking.studentId !== session.userId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "pending") {
    return NextResponse.json({ error: "Booking is not awaiting payment" }, { status: 409 });
  }

  const room = rooms.find((r) => r.id === booking.roomId)!;
  if (room.bedsAvailable < 1) {
    return NextResponse.json({ error: "No beds available in this room anymore" }, { status: 409 });
  }

  const payment = {
    id: genId("payment"),
    bookingId: booking.id,
    studentId: session.userId,
    amount: booking.bookingFeeAmount,
    momoTxnId: `MOCKMOMO-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    provider: "MTN" as const,
    status: "success" as const,
    paymentType: "booking_fee" as const,
    createdAt: new Date(),
  };
  payments.push(payment);

  booking.status = "reserved";
  booking.reservedUntil = new Date(Date.now() + RESERVATION_HOURS * 60 * 60 * 1000);

  room.bedsAvailable -= 1;
  if (room.bedsAvailable <= 0) room.status = "full";

  return NextResponse.json({ payment, booking });
}
