import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/content";

interface Params { params: { slug: string } }

export async function GET(_request: Request, { params }: Params) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
