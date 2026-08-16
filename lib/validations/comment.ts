import { z } from "zod";

export const commentStatusSchema = z.enum(["ACTIVE", "EDITED", "DELETED", "HIDDEN", "REPORTED"]);

export const createCommentSchema = z.object({
  content: z.string().min(1, "comment_required").max(2000, "comment_too_long").transform((v) => v.trim()),
  parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "comment_required").max(2000, "comment_too_long").transform((v) => v.trim()),
});

export const commentReactionSchema = z.object({
  type: z.enum(["HEART", "THUMBS_UP", "FIRE", "LIGHTBULB", "THUMBS_DOWN"]),
});

export const reportCommentSchema = z.object({
  reason: z.enum(["SPAM", "HARASSMENT", "OFFENSIVE", "ILLEGAL", "MALWARE", "OTHER"]),
  description: z.string().max(500).optional(),
});

export const commentSortSchema = z.enum(["newest", "oldest", "most_liked"]);

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentReactionInput = z.infer<typeof commentReactionSchema>;
export type ReportCommentInput = z.infer<typeof reportCommentSchema>;
