import { z } from "zod";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { users } from "../../../db/schema";

export const UserSchema = createSelectSchema(users);
export const UserResponseSchema = createSelectSchema(users).omit({
  password: true,
  googleId: true,
});
export const CreateUserSchema = createInsertSchema(users, {
  email: z.email(),
  password: z.string().min(6).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, googleId: true });

// Internal schema for creating users via OAuth (includes googleId)
export const CreateUserWithOAuthSchema = createInsertSchema(users, {
  email: z.email(),
}).omit({ id: true, createdAt: true, updatedAt: true, password: true });

export const UpdateUserSchema = createUpdateSchema(users, {
  email: z.email().optional(),
  password: z.string().min(6).optional(),
}).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  googleId: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type CreateUserWithOAuth = z.infer<typeof CreateUserWithOAuthSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
