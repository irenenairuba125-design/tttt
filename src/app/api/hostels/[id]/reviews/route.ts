import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bookings, reviews, recomputeHostelRating, genId } from "@/lib/store";

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

  const hasStayed = bookings.some(
    (b) =>
      b.hostelId === hostelId &&
      b.studentId === session.userId &&
      ["paid", "reserved", "checked_in", "checked_out"].includes(b.status)
  );

  if (!hasStayed) {
    return NextResponse.json(
      { error: "Only students who booked this hostel can leave a review" },
      { status: 403 }
    );
  }

  const review = {
    id: genId("review"),
    hostelId,
    studentId: session.userId,
    studentName: session.name,
    rating,
    comment: comment || null,
    createdAt: new Date(),
  };
  reviews.push(review);
  recomputeHostelRating(hostelId);

  return NextResponse.json(review, { status: 201 });
}
