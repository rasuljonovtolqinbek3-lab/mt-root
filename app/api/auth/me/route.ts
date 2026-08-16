import { NextResponse } from "next/server";
import { getCurrentUserSafe } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserSafe();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
