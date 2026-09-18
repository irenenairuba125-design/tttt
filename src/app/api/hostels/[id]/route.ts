import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const hostel = await prisma.hostel.findUnique({
    where: { id },
    include: {
      rooms: true,
      amenities: { include: { amenity: true } },
      reviews: { include: { student: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      university: true,
    },
  });

  if (!hostel || hostel.status !== "approved") {
    return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
  }

  const session = await getSession();
  let caretakerPhone: string | null = null;

  if (session) {
    const unlockedBooking = await prisma.booking.findFirst({
      where: {
        hostelId: id,
        studentId: session.userId,
        status: { in: ["paid", "reserved", "checked_in"] },
      },
    });
    if (unlockedBooking) caretakerPhone = hostel.caretakerPhone;
  }

  return NextResponse.json({ ...hostel, caretakerPhone });
}
