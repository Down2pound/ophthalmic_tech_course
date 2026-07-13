import type { NextFunction, Request, Response } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  get: (key: string) => RateLimitEntry | undefined;
  set: (key: string, entry: RateLimitEntry) => void;
  delete: (key: string) => void;
}

export interface RateLimitOptions {
  label: string;
  windowMs: number;
  maxRequests: number;
  now?: () => number;
  store?: RateLimitStore;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

export function createMemoryRateLimitStore(): RateLimitStore {
  const entries = new Map<string, RateLimitEntry>();

  return {
    get: key => entries.get(key),
    set: (key, entry) => entries.set(key, entry),
    delete: key => {
      entries.delete(key);
    },
  };
}

function clientKey(req: Request, label: string): string {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";

  return `${label}:${clientIp}`;
}

export function checkRateLimit({
  key,
  windowMs,
  maxRequests,
  now,
  store,
}: {
  key: string;
  windowMs: number;
  maxRequests: number;
  now: () => number;
  store: RateLimitStore;
}): RateLimitDecision {
  const currentTime = now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= currentTime) {
    const resetAt = currentTime + windowMs;
    store.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.ceil((existing.resetAt - currentTime) / 1000),
    };
  }

  const nextCount = existing.count + 1;
  store.set(key, { count: nextCount, resetAt: existing.resetAt });

  return {
    allowed: true,
    remaining: maxRequests - nextCount,
    resetAt: existing.resetAt,
  };
}

export function createRateLimitMiddleware({
  label,
  windowMs,
  maxRequests,
  now = () => Date.now(),
  store = createMemoryRateLimitStore(),
}: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const decision = checkRateLimit({
      key: clientKey(req, label),
      windowMs,
      maxRequests,
      now,
      store,
    });

    res.setHeader("X-RateLimit-Limit", String(maxRequests));
    res.setHeader("X-RateLimit-Remaining", String(decision.remaining));
    res.setHeader(
      "X-RateLimit-Reset",
      String(Math.ceil(decision.resetAt / 1000))
    );

    if (!decision.allowed) {
      res.setHeader("Retry-After", String(decision.retryAfterSeconds ?? 1));
      res.status(429).json({
        error: "Too many requests. Please wait and try again.",
      });
      return;
    }

    next();
  };
}
