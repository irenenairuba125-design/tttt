import { NextResponse } from "next/server";
import { amenities } from "@/lib/store";

export async function GET() {
  return NextResponse.json([...amenities].sort((a, b) => a.name.localeCompare(b.name)));
}
