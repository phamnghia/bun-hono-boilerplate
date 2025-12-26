import { describe, test, expect } from "bun:test";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ConflictError,
} from "../utils/errors";

describe("Error Classes", () => {
  test("AppError should be created with default values", () => {
    const error = new AppError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe("AppError");
  });

  test("AppError should accept custom status code", () => {
    const error = new AppError("Test error", 404);
    expect(error.statusCode).toBe(404);
  });

  test("NotFoundError should have 404 status", () => {
    const error = new NotFoundError("Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Resource not found");
  });

  test("UnauthorizedError should have 401 status", () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });

  test("BadRequestError should have 400 status", () => {
    const error = new BadRequestError("Invalid input");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Invalid input");
  });

  test("ConflictError should have 409 status", () => {
    const error = new ConflictError("Resource conflict");
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe("Resource conflict");
  });
});
