import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { AppError } from "./errors";
import { appConfig } from "../config/app";

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

export const ok = <T, S extends ContentfulStatusCode = 200>(
  c: Context,
  data: T,
  message?: string,
  status: S = 200 as S,
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

export const fail = <S extends ContentfulStatusCode = 500>(
  c: Context,
  message: string,
  status: S = 500 as S,
  error?: any
) => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Only include error details in non-production environments
  if (!appConfig.isProduction && error) {
    if (error instanceof AppError) {
      response.error = error.message;
      response.stack = error.stack;
    } else if (error instanceof Error) {
      response.error = error.message;
      response.stack = error.stack;
    } else {
      response.error = String(error);
    }
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
