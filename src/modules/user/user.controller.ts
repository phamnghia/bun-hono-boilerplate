import type { Context } from "hono";
import { UserService } from "./user.service";

export const UserController = {
  getAll: async (c: Context) => {
    const users = await UserService.getAll();
    return c.json(users);
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    const user = await UserService.getById(id);
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json(user);
  },

  create: async (c: Context) => {
    const data = c.req.valid("json");
    try {
      const user = await UserService.create(data);
      return c.json(user, 201);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique violation
        return c.json({ error: "Email already exists" }, 409);
      }
      return c.json({ error: "Failed to create user" }, 500);
    }
  },

  update: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    const data = c.req.valid("json");
    const user = await UserService.update(id, data);

    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(user);
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

    const user = await UserService.delete(id);
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json({ message: "User deleted successfully" });
  },
};
