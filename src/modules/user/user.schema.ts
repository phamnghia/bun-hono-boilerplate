import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../../db/schema";

export const UserSchema = createSelectSchema(users);
export const CreateUserSchema = createInsertSchema(users, {
  email: z.email(),
  password: z.string().min(6).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, googleId: true });

export const UpdateUserSchema = createInsertSchema(users).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  googleId: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
