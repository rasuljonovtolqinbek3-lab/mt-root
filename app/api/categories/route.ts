import { NextResponse } from "next/server";
import { getCategories } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;

  try {
    const categories = await getCategories(type);
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
