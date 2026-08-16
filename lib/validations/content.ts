import { z } from "zod";

export const postTypeSchema = z.enum(["ARTICLE", "NEWS", "TUTORIAL", "COURSE", "ANNOUNCEMENT", "VIDEO", "PDF", "CHALLENGE"]);
export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPostSchema = z.object({
  title: z.string().min(1, "Title required").max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  type: postTypeSchema.default("ARTICLE"),
  status: postStatusSchema.default("DRAFT"),
  categoryId: z.string().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  isFeatured: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  metaKeywords: z.string().max(200).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const updatePostSchema = createPostSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#00f0ff"),
  icon: z.string().optional(),
  type: z.string().default("cybersecurity"),
  parentId: z.string().optional(),
  order: z.number().int().default(0),
});

export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  category: z.string().optional(),
  type: postTypeSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
