import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ISSUER = "mt-root";
const AUDIENCE = "mt-root";
const COOKIE_NAME = "mt_session";

export interface SessionPayload {
  sub: string;
  nickname: string;
  role: string;
  status: string;
}

/**
 * Create a JWT session and set HTTP-only cookie
 * Works in Server Actions and Route Handlers (Node runtime)
 */
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({
    sub: payload.sub,
    nickname: payload.nickname,
    role: payload.role,
    status: payload.status,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/**
 * Verify JWT from cookie
 * Works in Middleware (Edge runtime) and Server Components/Actions
 */
export async function verifySession(
  request?: NextRequest
): Promise<SessionPayload | null> {
  const token = request
    ? request.cookies.get(COOKIE_NAME)?.value
    : (await cookies()).get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
      clockTolerance: 60,
    });

    return {
      sub: String(payload.sub),
      nickname: String(payload.nickname),
      role: String(payload.role),
      status: String(payload.status),
    };
  } catch {
    return null;
  }
}

/**
 * Delete session cookie
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Refresh session — re-issue with updated claims from DB
 */
export async function refreshSession(payload: SessionPayload) {
  await deleteSession();
  return createSession(payload);
}
