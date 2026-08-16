import { describe, it, expect } from "vitest";
import { nicknameSchema, RESERVED_NICKNAMES } from "@/lib/validations/auth";

describe("Nickname Validation", () => {
  it("accepts valid nicknames", () => {
    expect(nicknameSchema.parse("cyberwolf")).toBe("cyberwolf");
    expect(nicknameSchema.parse("RootX_123")).toBe("rootx_123");
    expect(nicknameSchema.parse("a_b_c")).toBe("a_b_c");
  });

  it("rejects nicknames that are too short", () => {
    expect(() => nicknameSchema.parse("ab")).toThrow("nickname_too_short");
  });

  it("rejects nicknames that are too long", () => {
    expect(() => nicknameSchema.parse("a".repeat(21))).toThrow("nickname_too_long");
  });

  it("rejects invalid characters", () => {
    expect(() => nicknameSchema.parse("test@user")).toThrow("nickname_invalid_chars");
    expect(() => nicknameSchema.parse("test user")).toThrow("nickname_invalid_chars");
    expect(() => nicknameSchema.parse("test<script>")).toThrow("nickname_invalid_chars");
  });

  it("rejects reserved nicknames", () => {
    RESERVED_NICKNAMES.forEach((name) => {
      expect(() => nicknameSchema.parse(name)).toThrow("nickname_reserved");
    });
  });

  it("normalizes to lowercase", () => {
    expect(nicknameSchema.parse("CyberWolf")).toBe("cyberwolf");
  });
});
