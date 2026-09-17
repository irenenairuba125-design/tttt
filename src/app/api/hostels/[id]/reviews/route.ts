import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: hostelId } = await params;
  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
  }

  const hasStayed = await prisma.booking.findFirst({
    where: {
      hostelId,
      studentId: session.userId,
      status: { in: ["paid", "reserved", "checked_in", "checked_out"] },
    },
  });

  if (!hasStayed) {
    return NextResponse.json(
      { error: "Only students who booked this hostel can leave a review" },
      { status: 403 }
    );
  }

  const review = await prisma.review.create({
    data: { hostelId, studentId: session.userId, rating, comment: comment || null },
  });

  const agg = await prisma.review.aggregate({
    where: { hostelId },
    _avg: { rating: true },
  });

  await prisma.hostel.update({
    where: { id: hostelId },
    data: { rating: agg._avg.rating ?? rating },
  });

  return NextResponse.json(review, { status: 201 });
}
