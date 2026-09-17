import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { hostel: true, room: true, payments: true },
  });

  if (!booking || booking.studentId !== session.userId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const unlocked = ["paid", "reserved", "checked_in"].includes(booking.status);

  return NextResponse.json({
    ...booking,
    hostel: { ...booking.hostel, caretakerPhone: unlocked ? booking.hostel.caretakerPhone : null },
  });
}
