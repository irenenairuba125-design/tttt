import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, password } = body;

  if (!phone || !password) {
    return NextResponse.json({ error: "phone and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, role: user.role });
}
