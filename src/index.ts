import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { fail, validationErrorResponse } from "./utils/response";

const app = new OpenAPIHono({
  defaultHook: validationErrorResponse,
});

app.use("*", logger());
app.use("*", cors());

app.onError((err, c) => {
  return fail(c, "Internal Server Error", 500, err);
});

app.notFound((c) => {
  return fail(c, "Not Found", 404);
});

// Routes
app.route("/users", userRoutes);
app.route("/auth", authRoutes);

// OpenAPI Doc
app.doc("/api-specs", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Bun Hono API",
  },
  servers: [
    { url: "http://localhost:3000" },
    { url: "https://bun-hono-api.vercel.app" },
  ],
});

// Scalar API Reference
app.get("/docs", Scalar({ url: "/api-specs" }));

// Expose OpenAPI Doc as Markdown for LLMs
const markdown = await createMarkdownFromOpenApi(
  JSON.stringify(
    app.getOpenAPI31Document({
      openapi: '3.1.0',
      info: { title: 'Example', version: 'v1' },
    })
  )
)
app.get('/llms.txt', async (c) => c.text(markdown))

export default {
  port: 3000,
  fetch: app.fetch,
};
