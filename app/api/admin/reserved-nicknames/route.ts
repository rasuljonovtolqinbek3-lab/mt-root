import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reserved = await prisma.reservedNickname.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reserved }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { nickname, reason } = body;

  if (!nickname || typeof nickname !== "string") {
    return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
  }

  const reserved = await prisma.reservedNickname.create({
    data: {
      nickname: nickname.toLowerCase().trim(),
      reason: reason || null,
    },
  });

  return NextResponse.json({ success: true, reserved }, { status: 201 });
}
