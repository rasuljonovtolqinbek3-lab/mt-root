import { describe, it, expect } from "vitest";
import { hashString, generateAvatar } from "@/lib/avatar";

describe("Avatar Generation", () => {
  it("generates deterministic avatars", () => {
    const a1 = generateAvatar("cyberwolf");
    const a2 = generateAvatar("cyberwolf");
    expect(a1).toBe(a2);
  });

  it("generates different avatars for different names", () => {
    const a1 = generateAvatar("user1");
    const a2 = generateAvatar("user2");
    expect(a1).not.toBe(a2);
  });

  it("returns base64 SVG", () => {
    const avatar = generateAvatar("test");
    expect(avatar.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });
});

describe("Hash Utility", () => {
  it("returns consistent hashes", () => {
    expect(hashString("test")).toBe(hashString("test"));
  });

  it("returns different hashes for different inputs", () => {
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});
