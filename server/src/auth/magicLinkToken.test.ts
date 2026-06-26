import { describe, expect, it } from "vitest";
import {
  createMagicLinkToken,
  hashMagicLinkToken,
  verifyMagicLinkToken,
} from "./magicLinkToken";

describe("createMagicLinkToken", () => {
  it("returns a raw token for email delivery and a separate hash for storage", () => {
    const token = createMagicLinkToken({
      randomBytes: () => Buffer.from("a".repeat(32)),
    });

    expect(token.rawToken).toHaveLength(43);
    expect(token.tokenHash).toBe(hashMagicLinkToken(token.rawToken));
    expect(token.tokenHash).not.toBe(token.rawToken);
  });
});

describe("verifyMagicLinkToken", () => {
  it("accepts the raw token when it matches the stored hash", () => {
    const token = createMagicLinkToken({
      randomBytes: () => Buffer.from("b".repeat(32)),
    });

    expect(verifyMagicLinkToken(token.rawToken, token.tokenHash)).toBe(true);
  });

  it("rejects the raw token when it does not match the stored hash", () => {
    const token = createMagicLinkToken({
      randomBytes: () => Buffer.from("c".repeat(32)),
    });

    expect(verifyMagicLinkToken("wrong-token", token.tokenHash)).toBe(false);
  });

  it("rejects malformed stored hashes without throwing", () => {
    expect(verifyMagicLinkToken("raw-token", "not-a-hex-hash")).toBe(false);
  });
});
