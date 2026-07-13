import { describe, expect, it } from "vitest";
import { applySecurityHeaders, securityHeaders } from "./securityHeaders";

describe("applySecurityHeaders", () => {
  it("sets browser safety headers without exposing secrets", () => {
    const headers = new Map<string, string>();
    const response = {
      setHeader: (name: string, value: string) => {
        headers.set(name, value);
      },
    };
    let nextCalled = false;

    applySecurityHeaders(
      {} as Parameters<typeof applySecurityHeaders>[0],
      response as Parameters<typeof applySecurityHeaders>[1],
      () => {
        nextCalled = true;
      }
    );

    expect(Object.fromEntries(headers)).toEqual(securityHeaders);
    expect(nextCalled).toBe(true);
    expect(JSON.stringify(Object.fromEntries(headers))).not.toContain("sk_");
    expect(JSON.stringify(Object.fromEntries(headers))).not.toContain("whsec_");
  });
});
