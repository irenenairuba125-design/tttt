import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUserByPhone } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, password } = body;

  if (!phone || !password) {
    return NextResponse.json({ error: "phone and password are required" }, { status: 400 });
  }

  const user = findUserByPhone(phone);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, role: user.role });
}
