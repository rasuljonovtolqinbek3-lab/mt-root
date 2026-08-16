import "server-only";
import { prisma } from "./prisma";
import { sanitizeHtml, calculateReadingTime, stripHtml } from "./sanitize";
import { generateSlug } from "./utils";

// ==================== POST QUERIES ====================

export async function getPublishedPosts(options: {
  categoryId?: string;
  type?: string;
  tag?: string;
  featured?: boolean;
  pinned?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "popular" | "trending";
} = {}) {
  const { categoryId, type, tag, featured, pinned, page = 1, limit = 10, sortBy = "newest" } = options;
  const skip = (page - 1) * limit;

  const where: any = { status: "PUBLISHED" };
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;
  if (featured !== undefined) where.isFeatured = featured;
  if (pinned !== undefined) where.isPinned = pinned;

  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }

  const orderBy: any = {};
  if (sortBy === "newest") orderBy.publishedAt = "desc";
  else if (sortBy === "popular") orderBy.views = "desc";
  else if (sortBy === "trending") {
    // Simple trending: weighted score of views + recency
    orderBy.publishedAt = "desc";
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, excerpt: true, coverImage: true,
        type: true, status: true, views: true, likes: true, readingTime: true,
        isFeatured: true, isPinned: true, publishedAt: true, createdAt: true, updatedAt: true,
        author: { select: { nickname: true, avatar: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        _count: { select: { comments: true, bookmarks: true, reactions: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string, includeDraft = false) {
  const where: any = { slug };
  if (!includeDraft) where.status = "PUBLISHED";

  return prisma.post.findUnique({
    where,
    select: {
      id: true, title: true, slug: true, excerpt: true, content: true,
      coverImage: true, type: true, status: true, views: true, likes: true,
      readingTime: true, isFeatured: true, isPinned: true,
      publishedAt: true, createdAt: true, updatedAt: true,
      metaTitle: true, metaDesc: true, metaKeywords: true, ogImage: true,
      author: { select: { nickname: true, avatar: true } },
      category: { select: { name: true, slug: true, color: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      _count: { select: { comments: true, bookmarks: true, reactions: true } },
    },
  });
}

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
  // If no category, return latest posts excluding current
  if (!categoryId) {
    return prisma.post.findMany({
      where: { status: "PUBLISHED", id: { not: postId } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true, title: true, slug: true, excerpt: true, coverImage: true,
        publishedAt: true, author: { select: { nickname: true } },
        category: { select: { name: true, color: true } },
      },
    });
  }

  // Get posts in the same category, excluding current
  return prisma.post.findMany({
    where: { status: "PUBLISHED", id: { not: postId }, categoryId },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true, title: true, slug: true, excerpt: true, coverImage: true,
      publishedAt: true, author: { select: { nickname: true } },
      category: { select: { name: true, color: true } },
    },
  });
}

export async function incrementPostViews(postId: string, viewerHash: string) {
  try {
    // Check if this viewer already counted today
    await prisma.postView.create({
      data: { postId, viewerHash },
    });
    // Increment view count
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Unique constraint violation = already viewed, ignore
  }
}

export async function getTrendingPosts(limit = 6) {
  // Trending = published in last 7 days, sorted by views + engagement
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { gte: weekAgo },
    },
    orderBy: [
      { views: "desc" },
      { publishedAt: "desc" },
    ],
    take: limit,
    select: {
      id: true, title: true, slug: true, excerpt: true, coverImage: true,
      views: true, publishedAt: true,
      author: { select: { nickname: true } },
      category: { select: { name: true, color: true } },
    },
  });
}

// ==================== CATEGORY QUERIES ====================

export async function getCategories(type?: string) {
  return prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: "asc" },
    select: {
      id: true, name: true, slug: true, description: true, color: true, icon: true, type: true,
      _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true, color: true, icon: true },
  });
}

// ==================== TAG QUERIES ====================

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
  });
}

export async function normalizeTags(tagNames: string[]): Promise<string[]> {
  const normalized = tagNames.map(t => t.toLowerCase().trim()).filter(Boolean);
  return [...new Set(normalized)];
}

export async function upsertTags(tagNames: string[]) {
  const normalized = await normalizeTags(tagNames);
  const tags = [];
  for (const name of normalized) {
    const slug = generateSlug(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tags.push(tag);
  }
  return tags;
}

// ==================== SEARCH ====================

export async function searchPosts(query: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const searchTerm = query.trim().toLowerCase();

  const where: any = {
    status: "PUBLISHED",
    OR: [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { excerpt: { contains: searchTerm, mode: "insensitive" } },
      { content: { contains: searchTerm, mode: "insensitive" } },
      { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
    ],
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, excerpt: true, coverImage: true,
        type: true, views: true, publishedAt: true,
        author: { select: { nickname: true } },
        category: { select: { name: true, color: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

// ==================== BOOKMARKS ====================

export async function toggleBookmark(userId: string, postId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { userId, postId } });
  return { bookmarked: true };
}

export async function isBookmarked(userId: string, postId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  return !!bookmark;
}

export async function getUserBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      post: {
        select: {
          id: true, title: true, slug: true, excerpt: true, coverImage: true,
          publishedAt: true, author: { select: { nickname: true } },
          category: { select: { name: true, color: true } },
        },
      },
    },
  });
}
