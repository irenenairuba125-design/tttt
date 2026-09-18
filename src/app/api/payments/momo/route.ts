import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { room: true } });
  if (!booking || booking.studentId !== session.userId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "pending") {
    return NextResponse.json({ error: "Booking is not awaiting payment" }, { status: 409 });
  }

  if (booking.room.bedsAvailable < 1) {
    return NextResponse.json({ error: "No beds available in this room anymore" }, { status: 409 });
  }

  const momoTxnId = `MOCKMOMO-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const reservedUntil = new Date(Date.now() + RESERVATION_HOURS * 60 * 60 * 1000);

  const [payment] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        bookingId: booking.id,
        studentId: session.userId,
        amount: booking.bookingFeeAmount,
        momoTxnId,
        provider: "MTN",
        status: "success",
        paymentType: "booking_fee",
      },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "reserved", reservedUntil },
    }),
    prisma.room.update({
      where: { id: booking.roomId },
      data: { bedsAvailable: { decrement: 1 } },
    }),
  ]);

  const room = await prisma.room.findUnique({ where: { id: booking.roomId } });
  if (room && room.bedsAvailable <= 0) {
    await prisma.room.update({ where: { id: booking.roomId }, data: { status: "full" } });
  }

  return NextResponse.json({
    payment,
    booking: { ...booking, status: "reserved", reservedUntil },
  });
}
