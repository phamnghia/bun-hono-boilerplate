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
 * Type guard to validate JWT payload structure
 */
function isValidJWTPayload(payload: unknown): payload is JWTPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "email" in payload &&
    typeof (payload as any).id === "number" &&
    typeof (payload as any).email === "string"
  );
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
    
    // Validate payload structure
    if (!isValidJWTPayload(payload)) {
      throw new UnauthorizedError("Invalid token payload structure");
    }
    
    // Add user to context
    c.set("user", payload);
    
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
    if (isValidJWTPayload(payload)) {
      c.set("user", payload);
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  await next();
};
