import type { Context, Next } from "hono";
import { AppError } from "../utils/errors";
import { fail } from "../utils/response";
import { logger } from "../utils/logger";

/**
 * Global error handler middleware
 * Catches errors thrown in controllers and converts them to proper responses
 */
export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof AppError) {
      return fail(c, error.message, error.statusCode as any, error);
    }

    // Log unexpected errors
    logger.error("Unexpected error occurred", error);

    // Default to 500 for unknown errors
    return fail(
      c,
      "An unexpected error occurred",
      500,
      error
    );
  }
};
