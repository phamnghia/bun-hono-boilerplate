import type { Context } from "hono";
import { UserService } from "./user.service";
import { ok, fail } from "../../utils/response";
import { UserResponseSchema } from "./schemas/user.schema";
import { z } from "zod";
import { NotFoundError, BadRequestError, ConflictError } from "../../utils/errors";
import { logger } from "../../utils/logger";

export const UserController = {
  getAll: async (c: Context) => {
    const users = await UserService.getAll();
    const safeUsers = z.array(UserResponseSchema).parse(users);
    return ok(c, safeUsers, "Users retrieved successfully");
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new BadRequestError("Invalid ID");

    const user = await UserService.getById(id);
    if (!user) throw new NotFoundError("User not found");

    const safeUser = UserResponseSchema.parse(user);
    return ok(c, safeUser, "User retrieved successfully");
  },

  create: async (c: Context & any) => {
    const data = c.req.valid("json");
    try {
      const user = await UserService.create(data);
      if (!user) throw new Error("Failed to create user");
      
      const safeUser = UserResponseSchema.parse(user);
      logger.info("User created", { userId: user.id, email: user.email });
      return ok(c, safeUser, "User created successfully", 201);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique violation
        throw new ConflictError("Email already exists");
      }
      logger.error("Failed to create user", error);
      throw error;
    }
  },

  update: async (c: Context & any) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new BadRequestError("Invalid ID");

    const data = c.req.valid("json");
    const user = await UserService.update(id, data);

    if (!user) throw new NotFoundError("User not found");

    const safeUser = UserResponseSchema.parse(user);
    logger.info("User updated", { userId: user.id });
    return ok(c, safeUser, "User updated successfully");
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new BadRequestError("Invalid ID");

    const user = await UserService.delete(id);
    if (!user) throw new NotFoundError("User not found");

    logger.info("User deleted", { userId: id });
    return ok(c, null, "User deleted successfully");
  },
};
