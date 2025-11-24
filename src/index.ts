import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";

const app = new OpenAPIHono();

app.use("*", logger());
app.use("*", cors());

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
});

// Scalar API Reference
app.get("/docs", Scalar({ url: "/api-specs" }));

export default {
  port: 3000,
  fetch: app.fetch,
};
