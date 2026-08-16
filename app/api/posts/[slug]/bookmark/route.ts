import { NextResponse } from "next/server";
import { getPostBySlug, toggleBookmark, isBookmarked } from "@/lib/content";
import { getCurrentUserSafe } from "@/lib/auth";

interface Params { params: { slug: string } }

export async function POST(_request: Request, { params }: Params) {
  try {
    const user = await getCurrentUserSafe();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const result = await toggleBookmark(user.id, post.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await getCurrentUserSafe();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const bookmarked = await isBookmarked(user.id, post.id);
    return NextResponse.json({ bookmarked }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check bookmark" }, { status: 500 });
  }
}
