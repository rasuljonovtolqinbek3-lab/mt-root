import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nickname: true,
      role: true,
      status: true,
      avatar: true,
      xp: true,
      streak: true,
      lastActiveAt: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          submissions: true,
          ctfSubmissions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ users }, { status: 200 });
}
