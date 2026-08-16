import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/content";
import { searchSchema } from "@/lib/validations/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const type = searchParams.get("type") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const pinned = searchParams.get("pinned") === "true" ? true : undefined;
  const sortBy = (searchParams.get("sortBy") as any) || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

  try {
    const result = await getPublishedPosts({
      categoryId, type, tag, featured, pinned, sortBy, page, limit,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Posts API error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
