import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { updatePostSchema } from "@/lib/validations/content";
import { sanitizeHtml, calculateReadingTime, upsertTags } from "@/lib/content";

interface Params { params: { id: string } }

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = updatePostSchema.parse(body);

    const updateData: any = {};
    if (validated.title) updateData.title = validated.title;
    if (validated.slug) updateData.slug = validated.slug;
    if (validated.excerpt !== undefined) updateData.excerpt = validated.excerpt;
    if (validated.content) {
      updateData.content = sanitizeHtml(validated.content);
      updateData.readingTime = calculateReadingTime(updateData.content);
    }
    if (validated.coverImage !== undefined) updateData.coverImage = validated.coverImage || null;
    if (validated.type) updateData.type = validated.type;
    if (validated.status) {
      updateData.status = validated.status;
      if (validated.status === "PUBLISHED") updateData.publishedAt = new Date();
    }
    if (validated.categoryId !== undefined) updateData.categoryId = validated.categoryId || null;
    if (validated.isFeatured !== undefined) updateData.isFeatured = validated.isFeatured;
    if (validated.isPinned !== undefined) updateData.isPinned = validated.isPinned;
    if (validated.metaTitle !== undefined) updateData.metaTitle = validated.metaTitle;
    if (validated.metaDesc !== undefined) updateData.metaDesc = validated.metaDesc;
    if (validated.metaKeywords !== undefined) updateData.metaKeywords = validated.metaKeywords;
    if (validated.ogImage !== undefined) updateData.ogImage = validated.ogImage;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update tags
    if (validated.tags) {
      await prisma.postTag.deleteMany({ where: { postId: params.id } });
      const tags = await upsertTags(validated.tags);
      await prisma.postTag.createMany({
        data: tags.map(tag => ({ postId: params.id, tagId: tag.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
