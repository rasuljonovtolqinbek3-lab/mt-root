import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const { action } = body; // "ban" | "unban" | "mute" | "unmute" | "suspend"

  if (!["ban", "unban", "mute", "unmute", "suspend"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    ban: "BANNED",
    unban: "ACTIVE",
    mute: "MUTED",
    unmute: "ACTIVE",
    suspend: "SUSPENDED",
  };

  const user = await prisma.user.update({
    where: { id },
    data: { status: statusMap[action] as any },
    select: { id: true, nickname: true, status: true },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: `USER_${action.toUpperCase()}`,
      entity: "User",
      entityId: user.id,
      newData: { status: user.status },
    },
  });

  return NextResponse.json({ success: true, user }, { status: 200 });
}
