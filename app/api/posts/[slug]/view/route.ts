import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, incrementPostViews } from "@/lib/content";
import { createHash } from "crypto";

interface Params { params: { slug: string } }

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const ip = request.ip || "unknown";
    const userAgent = request.headers.get("user-agent") || "";
    const date = new Date().toISOString().split("T")[0];
    const viewerHash = createHash("sha256").update(`${ip}:${userAgent}:${date}:${post.id}`).digest("hex").slice(0, 32);

    await incrementPostViews(post.id, viewerHash);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
