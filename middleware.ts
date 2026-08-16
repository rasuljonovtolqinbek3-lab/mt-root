import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");
const ISSUER = "mt-root";
const AUDIENCE = "mt-root";

// Public routes that never require auth
const PUBLIC_PATHS = [
  "/",
  "/news",
  "/learning",
  "/pentesting",
  "/red-team",
  "/wifi-security",
  "/linux",
  "/ctf",
  "/programming",
  "/competitions",
  "/community",
  "/mt-root",
  "/services",
  "/onboarding",
  "/banned",
];

// Auth API routes (must be accessible without auth)
const AUTH_API_PATHS = ["/api/auth/nickname", "/api/auth/logout", "/api/auth/me"];

// Protected route prefixes
const PROTECTED_PATHS = ["/profile", "/bookmarks", "/notifications", "/settings"];
const ADMIN_PATHS = ["/admin"];
const MODERATOR_PATHS = ["/moderator"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (AUTH_API_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/api/")) return true; // API routes handle their own auth
  return false;
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
      clockTolerance: 60,
    });
    return payload as { sub: string; nickname: string; role: string; status: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths immediately
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isModerator = MODERATOR_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAdmin && !isModerator) {
    return NextResponse.next();
  }

  // Verify session
  const token = request.cookies.get("mt_session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const session = await verifyToken(token);

  if (!session) {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Session expired" }, { status: 401 })
      : NextResponse.redirect(new URL("/onboarding", request.url));
    // Clear invalid cookie
    if (!pathname.startsWith("/api/")) {
      response.cookies.delete("mt_session");
    }
    return response;
  }

  // Check banned status
  if (session.status === "BANNED") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Account banned" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  // Check admin access
  if (isAdmin && !["ADMIN", "SUPER_ADMIN"].includes(session.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check moderator access
  if (isModerator && !["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Forward session data to downstream handlers via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.sub);
  requestHeaders.set("x-user-nickname", session.nickname);
  requestHeaders.set("x-user-role", session.role);
  requestHeaders.set("x-user-status", session.status);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|sitemap\.xml|robots\.txt|.*\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)$).*)",
  ],
};
