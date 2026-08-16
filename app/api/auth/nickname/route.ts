import { NextRequest, NextResponse } from "next/server";
import { authenticateNickname } from "@/lib/auth";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { ZodError } from "zod";
import { nicknameSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.ip || "unknown";
  const rateLimitResult = rateLimit(`nickname:${ip}`, 5, 60000);
  const headers = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "rate_limit_exceeded", message: "Too many attempts. Please wait." },
      { status: 429, headers }
    );
  }

  try {
    const body = await request.json();
    const { nickname } = body;

    // Validate input
    if (!nickname || typeof nickname !== "string") {
      return NextResponse.json(
        { error: "invalid_input", message: "Nickname is required" },
        { status: 400, headers }
      );
    }

    // Sanitize - prevent XSS/HTML injection
    const sanitized = nickname
      .replace(/[<>"'&]/g, "")
      .trim();

    const result = await authenticateNickname(sanitized, ip);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, field: result.field },
        { status: 400, headers }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user?.sub,
          nickname: result.user?.nickname,
        },
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500, headers }
    );
  }
}
