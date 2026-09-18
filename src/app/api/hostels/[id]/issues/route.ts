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
  const { description } = await req.json();

  if (!description || !description.trim()) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  const hasBooked = await prisma.booking.findFirst({
    where: {
      hostelId,
      studentId: session.userId,
      status: { in: ["paid", "reserved", "checked_in", "checked_out"] },
    },
  });

  if (!hasBooked) {
    return NextResponse.json(
      { error: "Only students who booked this hostel can report an issue" },
      { status: 403 }
    );
  }

  const issue = await prisma.issue.create({
    data: { hostelId, studentId: session.userId, description: description.trim() },
  });

  return NextResponse.json(issue, { status: 201 });
}
