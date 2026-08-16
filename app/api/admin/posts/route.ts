import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations/content";
import { sanitizeHtml, calculateReadingTime, upsertTags } from "@/lib/content";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const type = searchParams.get("type") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, type: true, status: true,
        views: true, isFeatured: true, isPinned: true,
        publishedAt: true, createdAt: true, updatedAt: true,
        author: { select: { nickname: true } },
        category: { select: { name: true } },
        _count: { select: { comments: true, bookmarks: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit) }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createPostSchema.parse(body);

    // Sanitize content
    const cleanContent = sanitizeHtml(validated.content);
    const readingTime = calculateReadingTime(cleanContent);

    // Auto-generate slug if not provided
    const slug = validated.slug || generateSlug(validated.title);

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug,
        excerpt: validated.excerpt,
        content: cleanContent,
        coverImage: validated.coverImage || null,
        type: validated.type,
        status: validated.status,
        categoryId: validated.categoryId,
        readingTime,
        isFeatured: validated.isFeatured,
        isPinned: validated.isPinned,
        metaTitle: validated.metaTitle,
        metaDesc: validated.metaDesc,
        metaKeywords: validated.metaKeywords,
        ogImage: validated.ogImage,
        authorId: (await requireAdmin()).id,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Handle tags
    if (validated.tags && validated.tags.length > 0) {
      const tags = await upsertTags(validated.tags);
      await prisma.postTag.createMany({
        data: tags.map(tag => ({ postId: post.id, tagId: tag.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
