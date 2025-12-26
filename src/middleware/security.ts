import type { Context, Next } from "hono";
import { appConfig } from "../config/app";

/**
 * Security headers middleware
 * Adds various security headers to responses
 */
export const securityHeaders = async (c: Context, next: Next) => {
  await next();

  // Prevent clickjacking
  c.header("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  c.header("X-Content-Type-Options", "nosniff");

  // Enable XSS protection (for older browsers)
  c.header("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (adjust based on your needs)
  if (!appConfig.isDevelopment) {
    c.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
    );
  }

  // Strict-Transport-Security (HSTS) - only in production with HTTPS
  if (appConfig.isProduction) {
    c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Permissions Policy (formerly Feature Policy)
  c.header(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
};
