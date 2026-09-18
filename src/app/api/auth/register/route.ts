import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUserByPhone, registeredUsers, genId, type DemoUser } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, password, gender } = body;

  if (!name || !phone || !password) {
    return NextResponse.json(
      { error: "name, phone and password are required" },
      { status: 400 }
    );
  }

  if (findUserByPhone(phone)) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const user: DemoUser = {
    id: genId("user"),
    name,
    phone,
    password,
    role: "student",
    gender: gender || undefined,
  };
  registeredUsers.push(user);

  await createSession({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, role: user.role });
}
