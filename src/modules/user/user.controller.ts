import type { Context } from "hono";
import { UserService } from "./user.service";
import { ok, fail } from "../../utils/response";
import { UserResponseSchema } from "./schemas/user.schema";
import { z } from "zod";

export const UserController = {
  getAll: async (c: Context) => {
    const users = await UserService.getAll();
    const safeUsers = z.array(UserResponseSchema).parse(users);
    return ok(c, safeUsers, "Users retrieved successfully");
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return fail(c, "Invalid ID", 400);

    const user = await UserService.getById(id);
    if (!user) return fail(c, "User not found", 404);

    const safeUser = UserResponseSchema.parse(user);
    return ok(c, safeUser, "User retrieved successfully");
  },

  create: async (c: Context & any) => {
    const data = c.req.valid("json");
    try {
      const user = await UserService.create(data);
      const safeUser = UserResponseSchema.parse(user);
      return ok(c, safeUser, "User created successfully", 201);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique violation
        return fail(c, "Email already exists", 409);
      }
      return fail(c, "Failed to create user", 500, error);
    }
  },

  update: async (c: Context & any) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return fail(c, "Invalid ID", 400);

    const data = c.req.valid("json");
    const user = await UserService.update(id, data);

    if (!user) return fail(c, "User not found", 404);

    const safeUser = UserResponseSchema.parse(user);
    return ok(c, safeUser, "User updated successfully");
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return fail(c, "Invalid ID", 400);

    const user = await UserService.delete(id);
    if (!user) return fail(c, "User not found", 404);

    return ok(c, null, "User deleted successfully");
  },
};
