import type { Context } from "hono";
import { UserService } from "./user.service";
import { successResponse, errorResponse } from "../../utils/response";
import { UserResponseSchema } from "./user.schema";
import { z } from "zod";

export const UserController = {
  getAll: async (c: Context) => {
    const users = await UserService.getAll();
    const safeUsers = z.array(UserResponseSchema).parse(users);
    return successResponse(c, safeUsers, "Users retrieved successfully");
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return errorResponse(c, "Invalid ID", 400);

    const user = await UserService.getById(id);
    if (!user) return errorResponse(c, "User not found", 404);

    const safeUser = UserResponseSchema.parse(user);
    return successResponse(c, safeUser, "User retrieved successfully");
  },

  create: async (c: Context) => {
    const data = c.req.valid("json");
    try {
      const user = await UserService.create(data);
      const safeUser = UserResponseSchema.parse(user);
      return successResponse(c, safeUser, "User created successfully", 201);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique violation
        return errorResponse(c, "Email already exists", 409);
      }
      return errorResponse(c, "Failed to create user", 500, error);
    }
  },

  update: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return errorResponse(c, "Invalid ID", 400);

    const data = c.req.valid("json");
    const user = await UserService.update(id, data);

    if (!user) return errorResponse(c, "User not found", 404);

    const safeUser = UserResponseSchema.parse(user);
    return successResponse(c, safeUser, "User updated successfully");
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return errorResponse(c, "Invalid ID", 400);

    const user = await UserService.delete(id);
    if (!user) return errorResponse(c, "User not found", 404);

    return successResponse(c, null, "User deleted successfully");
  },
};
