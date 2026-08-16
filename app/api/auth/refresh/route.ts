import { NextResponse } from "next/server";
import { verifySession, createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, nickname: true, role: true, status: true },
  });

  if (!user || user.status === "BANNED") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Refresh session
  await createSession({
    sub: user.id,
    nickname: user.nickname,
    role: user.role,
    status: user.status,
  });

  return NextResponse.json({ success: true, user }, { status: 200 });
}
