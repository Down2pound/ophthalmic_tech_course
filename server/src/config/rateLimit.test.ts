import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  createMemoryRateLimitStore,
  createRateLimitMiddleware,
} from "./rateLimit";

describe("checkRateLimit", () => {
  it("allows requests until the window limit is reached", () => {
    const store = createMemoryRateLimitStore();
    const input = {
      key: "checkout:127.0.0.1",
      windowMs: 60_000,
      maxRequests: 2,
      now: () => 1_000,
      store,
    };

    expect(checkRateLimit(input)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(checkRateLimit(input)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(checkRateLimit(input)).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    });
  });

  it("resets after the window expires", () => {
    const store = createMemoryRateLimitStore();

    expect(
      checkRateLimit({
        key: "auth:127.0.0.1",
        windowMs: 60_000,
        maxRequests: 1,
        now: () => 1_000,
        store,
      }).allowed
    ).toBe(true);
    expect(
      checkRateLimit({
        key: "auth:127.0.0.1",
        windowMs: 60_000,
        maxRequests: 1,
        now: () => 61_001,
        store,
      }).allowed
    ).toBe(true);
  });
});

describe("createRateLimitMiddleware", () => {
  it("returns 429 and Retry-After after too many requests", () => {
    const middleware = createRateLimitMiddleware({
      label: "practice-inquiry",
      windowMs: 60_000,
      maxRequests: 1,
      now: () => 1_000,
    });
    const headers = new Map<string, string>();
    const response = {
      setHeader: (name: string, value: string) => headers.set(name, value),
      status: (statusCode: number) => {
        headers.set("status", String(statusCode));
        return response;
      },
      json: (payload: unknown) => {
        headers.set("payload", JSON.stringify(payload));
      },
    };
    const request = {
      ip: "127.0.0.1",
      get: () => undefined,
      socket: {},
    };
    let nextCalls = 0;

    middleware(
      request as Parameters<typeof middleware>[0],
      response as Parameters<typeof middleware>[1],
      () => {
        nextCalls += 1;
      }
    );
    middleware(
      request as Parameters<typeof middleware>[0],
      response as Parameters<typeof middleware>[1],
      () => {
        nextCalls += 1;
      }
    );

    expect(nextCalls).toBe(1);
    expect(headers.get("status")).toBe("429");
    expect(headers.get("Retry-After")).toBe("60");
    expect(headers.get("payload")).toContain("Too many requests");
  });
});
