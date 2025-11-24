import { z } from "@hono/zod-openapi";

export const createResponseSchema = <T extends z.ZodTypeAny>(
  schema: T,
  messageExample: string = "Success"
) => {
  return z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().optional().openapi({ example: messageExample }),
    data: schema,
  });
};

export const createErrorSchema = (messageExample: string = "Error") => {
  return z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: messageExample }),
    error: z.string().optional(),
    stack: z.string().optional(),
  });
};
