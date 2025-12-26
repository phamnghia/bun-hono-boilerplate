/**
 * Shared types used across the application
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  message?: string;
  data: T[];
  meta: PaginationMeta;
}

// Re-export commonly used types
export type { JWTPayload } from "../middleware/auth";
