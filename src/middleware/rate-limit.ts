import type { Context, Next } from "hono";
import { TooManyRequestsError } from "../utils/errors";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key]!.resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  windowMs?: number;  // Time window in milliseconds
  maxRequests?: number;  // Maximum number of requests per window
  keyGenerator?: (c: Context) => string;  // Function to generate the rate limit key
}

/**
 * Rate limiting middleware
 * Limits the number of requests from a single IP/user within a time window
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    keyGenerator = (c: Context) => {
      // Try to get IP from various headers
      return (
        c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
        c.req.header("x-real-ip") ||
        "unknown"
      );
    },
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    if (!store[key] || store[key]!.resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key]!.count++;
    }

    const current = store[key]!;

    // Set rate limit headers
    c.header("X-RateLimit-Limit", maxRequests.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, maxRequests - current.count).toString());
    c.header("X-RateLimit-Reset", new Date(current.resetTime).toISOString());

    if (current.count > maxRequests) {
      throw new TooManyRequestsError("Too many requests, please try again later");
    }

    await next();
  };
}

/**
 * Stricter rate limit for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * Standard rate limit for API endpoints
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});
