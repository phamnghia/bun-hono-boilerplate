import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { AuthController } from "./auth.controller";
import { errorHandler } from "../../middleware/error-handler";

const app = new OpenAPIHono();

// Apply error handler middleware
app.use("*", errorHandler);

app.openapi(
  createRoute({
    method: "get",
    path: "/google",
    tags: ["Auth"],
    responses: {
      302: {
        description: "Redirect to Google Login",
      },
    },
  }),
  AuthController.googleLogin
);

app.openapi(
  createRoute({
    method: "get",
    path: "/google/callback",
    tags: ["Auth"],
    request: {
      query: z.object({
        code: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().optional().openapi({ example: "Authentication successful" }),
              data: z.object({
                token: z.string(),
                user: z.object({
                  id: z.number(),
                  email: z.string(),
                  name: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      400: {
        description: "Login Failed",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean().openapi({ example: false }),
              message: z.string().openapi({ example: "No authorization code provided" }),
            }),
          },
        },
      },
    },
  }),
  AuthController.googleCallback
);

export default app;
