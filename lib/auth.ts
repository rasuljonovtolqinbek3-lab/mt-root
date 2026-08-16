import "server-only";
import { prisma } from "./prisma";
import { verifySession, createSession, deleteSession, type SessionPayload } from "./session";
import { generateAvatar } from "./avatar";
import { rateLimit } from "./rate-limit";
import { nicknameSchema } from "./validations/auth";
import { ZodError } from "zod";

// ==================== USER QUERIES ====================

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      role: true,
      status: true,
      avatar: true,
      bio: true,
      xp: true,
      streak: true,
      maxStreak: true,
      lastLoginAt: true,
      lastActiveAt: true,
      createdAt: true,
      level: { select: { id: true, name: true, number: true, color: true } },
      _count: {
        select: {
          comments: true,
          submissions: true,
          ctfSubmissions: true,
          bookmarks: true,
          achievements: true,
        },
      },
    },
  });
}

export async function getUserByNickname(nickname: string) {
  return prisma.user.findUnique({
    where: { nickname: nickname.toLowerCase() },
    select: { id: true, nickname: true, status: true },
  });
}

export async function getCurrentUser() {
  const session = await verifySession();
  if (!session) return null;

  const user = await getUserById(session.sub);
  if (!user || user.status === "BANNED") return null;

  return user;
}

export async function getCurrentUserSafe() {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      nickname: true,
      role: true,
      status: true,
      avatar: true,
      xp: true,
      streak: true,
      level: { select: { name: true, number: true } },
    },
  });

  if (!user || user.status === "BANNED") return null;
  return user;
}

// ==================== AUTHENTICATION ====================

export interface AuthResult {
  success: boolean;
  user?: SessionPayload;
  error?: string;
  field?: string;
}

export async function authenticateNickname(
  nickname: string,
  ipAddress?: string
): Promise<AuthResult> {
  // Rate limit by IP
  if (ipAddress) {
    const limit = rateLimit(`auth:${ipAddress}`, 10, 60000);
    if (!limit.success) {
      return { success: false, error: "rate_limit_exceeded" };
    }
  }

  // Validate nickname
  try {
    nicknameSchema.parse(nickname);
  } catch (err) {
    if (err instanceof ZodError) {
      const issue = err.issues[0];
      return { success: false, error: issue.message, field: "nickname" };
    }
    return { success: false, error: "invalid_nickname" };
  }

  const normalized = nickname.trim().toLowerCase();

  // Check reserved nicknames
  const reserved = await prisma.reservedNickname.findUnique({
    where: { nickname: normalized },
  });
  if (reserved) {
    return { success: false, error: "nickname_reserved", field: "nickname" };
  }

  // Check if user exists
  const existing = await getUserByNickname(normalized);
  if (existing) {
    // If existing and active, return error
    if (existing.status !== "BANNED") {
      return { success: false, error: "nickname_taken", field: "nickname" };
    }
    // If banned, still don't allow reuse for security
    return { success: false, error: "nickname_unavailable", field: "nickname" };
  }

  // Create anonymous user
  const avatar = generateAvatar(normalized);
  const user = await prisma.user.create({
    data: {
      nickname: normalized,
      avatar,
      role: "USER",
      status: "ACTIVE",
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
    },
    select: {
      id: true,
      nickname: true,
      role: true,
      status: true,
    },
  });

  // Create session
  await createSession({
    sub: user.id,
    nickname: user.nickname,
    role: user.role,
    status: user.status,
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
      ipAddress: ipAddress || null,
    },
  });

  return {
    success: true,
    user: {
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
      status: user.status,
    },
  };
}

export async function loginExistingUser(
  nickname: string,
  ipAddress?: string
): Promise<AuthResult> {
  if (ipAddress) {
    const limit = rateLimit(`auth:${ipAddress}`, 10, 60000);
    if (!limit.success) {
      return { success: false, error: "rate_limit_exceeded" };
    }
  }

  const normalized = nickname.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { nickname: normalized },
    select: { id: true, nickname: true, role: true, status: true },
  });

  if (!user) {
    return { success: false, error: "user_not_found" };
  }

  if (user.status === "BANNED") {
    return { success: false, error: "user_banned" };
  }

  if (user.status === "SUSPENDED") {
    return { success: false, error: "user_suspended" };
  }

  // Update last active
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), lastActiveAt: new Date() },
  });

  await createSession({
    sub: user.id,
    nickname: user.nickname,
    role: user.role,
    status: user.status,
  });

  return {
    success: true,
    user: {
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
      status: user.status,
    },
  };
}

export async function logoutUser() {
  await deleteSession();
  return { success: true };
}

// ==================== ADMIN UTILITIES ====================

export async function requireAdmin() {
  const user = await getCurrentUserSafe();
  if (!user) throw new Error("Unauthorized");
  if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireModerator() {
  const user = await getCurrentUserSafe();
  if (!user) throw new Error("Unauthorized");
  if (!["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function banUser(userId: string, reason?: string) {
  await requireAdmin();
  return prisma.user.update({
    where: { id: userId },
    data: { status: "BANNED" },
  });
}

export async function unbanUser(userId: string) {
  await requireAdmin();
  return prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });
}
