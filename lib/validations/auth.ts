import { z } from "zod";

export const RESERVED_NICKNAMES = new Set([
  "admin", "administrator", "moderator", "mod", "system",
  "mt_root", "mtroot", "mt-root", "official", "support",
  "help", "root", "superuser", "owner", "staff", "team",
  "mtrootuz", "mt_root_uz", "anonymous", "anon", "user",
  "test", "testing", "null", "undefined", "api", "www",
  "mail", "ftp", "localhost", "dev", "development",
]);

export const nicknameSchema = z
  .string()
  .min(3, "nickname_too_short")
  .max(20, "nickname_too_long")
  .regex(/^[a-zA-Z0-9_]+$/, "nickname_invalid_chars")
  .refine(
    (val) => !RESERVED_NICKNAMES.has(val.toLowerCase()),
    "nickname_reserved"
  )
  .transform((val) => val.trim().toLowerCase());

export const loginSchema = z.object({
  nickname: nicknameSchema,
});

export type NicknameInput = z.infer<typeof nicknameSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
