import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { AuthService } from "./auth.service";

const app = new OpenAPIHono();

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
  (c) => {
    return c.redirect(AuthService.getGoogleAuthURL());
  }
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
              token: z.string(),
              user: z.object({
                id: z.number(),
                email: z.string(),
                name: z.string().nullable(),
              }),
            }),
          },
        },
      },
      400: {
        description: "Login Failed",
      },
    },
  }),
  async (c) => {
    const code = c.req.query("code");
    if (!code) return c.json({ error: "No code provided" }, 400);

    try {
      const googleUser = await AuthService.getGoogleUser(code);
      const { user, token } = await AuthService.loginOrRegister(googleUser);
      return c.json({ token, user });
    } catch (error) {
      return c.json({ error: "Authentication failed" }, 400);
    }
  }
);

export default app;
