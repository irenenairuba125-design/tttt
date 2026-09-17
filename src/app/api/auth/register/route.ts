import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, password, gender } = body;

  if (!name || !phone || !password) {
    return NextResponse.json(
      { error: "name, phone and password are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email: email || null,
      passwordHash,
      gender: gender || null,
      role: "student",
    },
  });

  await createSession({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, role: user.role });
}
