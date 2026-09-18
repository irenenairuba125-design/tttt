import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bookings, issues, genId } from "@/lib/store";

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

  const hasBooked = bookings.some(
    (b) =>
      b.hostelId === hostelId &&
      b.studentId === session.userId &&
      ["paid", "reserved", "checked_in", "checked_out"].includes(b.status)
  );

  if (!hasBooked) {
    return NextResponse.json(
      { error: "Only students who booked this hostel can report an issue" },
      { status: 403 }
    );
  }

  const issue = {
    id: genId("issue"),
    hostelId,
    studentId: session.userId,
    description: description.trim(),
    status: "open" as const,
    createdAt: new Date(),
  };
  issues.push(issue);

  return NextResponse.json(issue, { status: 201 });
}
