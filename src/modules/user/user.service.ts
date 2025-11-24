import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import type { CreateUser, UpdateUser } from "./user.schema";

export const UserService = {
  getAll: async () => {
    return await db.select().from(users);
  },

  getById: async (id: number) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  getByEmail: async (email: string) => {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  },

  create: async (data: CreateUser) => {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  update: async (id: number, data: UpdateUser) => {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: number) => {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  },
};
