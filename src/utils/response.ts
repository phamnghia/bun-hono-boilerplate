import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

// --- Interfaces ---

export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: "Validation Errors";
  errors: Record<string, string[] | string>;
}

// --- Helpers ---

export const successResponse = <T>(
  c: Context,
  data: T,
  message?: string,
  status: ContentfulStatusCode = 200,
  meta?: SuccessResponse["meta"]
) => {
  return c.json(
    {
      success: true,
      message,
      data,
      meta,
    } as SuccessResponse<T>,
    status
  );
};

export const errorResponse = (
  c: Context,
  message: string,
  status: ContentfulStatusCode = 500,
  error?: any
) => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production" && error) {
    response.error = error.message || String(error);
    response.stack = error.stack;
  }

  return c.json(response, status);
};

export const validationErrorResponse = (
  result: { success: boolean; error?: z.ZodError; data?: any },
  c: Context
) => {
  if (!result.success && result.error) {
    const formattedErrors: Record<string, string[]> = {};

    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    });

    return c.json(
      {
        success: false,
        message: "Validation Errors",
        errors: formattedErrors,
      } as ValidationErrorResponse,
      422
    );
  }
};
