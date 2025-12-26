/**
 * Application-wide constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "You don't have permission to access this resource",
  INVALID_TOKEN: "Invalid or expired token",
  MISSING_AUTH_HEADER: "Missing or invalid authorization header",
  INTERNAL_ERROR: "An internal error occurred",
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USERS_RETRIEVED: "Users retrieved successfully",
  USER_RETRIEVED: "User retrieved successfully",
  AUTH_SUCCESS: "Authentication successful",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
