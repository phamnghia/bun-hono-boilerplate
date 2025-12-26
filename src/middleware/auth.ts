import type { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { appConfig } from "../config/app";
import { UnauthorizedError } from "../utils/errors";

export interface JWTPayload {
  id: number;
  email: string;
}

// Extend Context type to include user
declare module "hono" {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

/**
 * JWT Authentication middleware
 * Verifies the JWT token from Authorization header and adds user to context
 */
export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, appConfig.auth.jwtSecret);
    
    // Add user to context (cast through unknown to avoid type conflicts)
    c.set("user", payload as unknown as JWTPayload);
    
    await next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

/**
 * Optional JWT Authentication middleware
 * Similar to authenticate but doesn't throw if no token is provided
 */
export const optionalAuthenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    await next();
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, appConfig.auth.jwtSecret);
    c.set("user", payload as unknown as JWTPayload);
  } catch (error) {
    // Silently fail for optional auth
  }

  await next();
};
