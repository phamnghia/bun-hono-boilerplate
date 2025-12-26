import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger as honoLogger } from "hono/logger";
import { cors } from "hono/cors";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { fail, validationErrorResponse } from "./utils/response";
import { appConfig } from "./config/app";
import { logger } from "./utils/logger";

const app = new OpenAPIHono({
  defaultHook: validationErrorResponse,
});

// Middleware
app.use("*", honoLogger());
app.use("*", cors(appConfig.cors));

// Error handling
app.onError((err, c) => {
  logger.error("Unhandled error", err);
  return fail(c, "Internal Server Error", 500, err);
});

app.notFound((c) => {
  return fail(c, "Not Found", 404);
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.route("/users", userRoutes);
app.route("/auth", authRoutes);

// OpenAPI Doc
app.doc("/api-specs", {
  openapi: "3.0.0",
  info: {
    version: appConfig.api.version,
    title: appConfig.api.title,
  },
  servers: [
    { url: appConfig.baseUrl },
  ],
});

// Scalar API Reference
app.get("/docs", Scalar({ url: "/api-specs" }));

// Expose OpenAPI Doc as Markdown for LLMs
const markdown = await createMarkdownFromOpenApi(
  JSON.stringify(
    app.getOpenAPI31Document({
      openapi: '3.1.0',
      info: { title: appConfig.api.title, version: appConfig.api.version },
    })
  )
)
app.get('/llms.txt', async (c) => c.text(markdown))

logger.info(`🚀 Server starting on port ${appConfig.port}`);
logger.info(`📚 API Documentation available at ${appConfig.baseUrl}/docs`);
logger.info(`🏥 Health check available at ${appConfig.baseUrl}/health`);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
