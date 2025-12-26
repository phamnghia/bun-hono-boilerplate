import { OpenAPIHono } from "@hono/zod-openapi";
import { validationErrorResponse } from "../../utils/response";
import { UserController } from "./user.controller";
import { createUserRoute, deleteUserRoute, getAllUsersRoute, getUserByIdRoute, updateUserRoute, getMeRoute } from "./schemas/route.schema";
import { errorHandler } from "../../middleware/error-handler";
import { authenticate } from "../../middleware/auth";

const app = new OpenAPIHono({
    defaultHook: validationErrorResponse,
});

// Apply error handler middleware
app.use("*", errorHandler);

// Protected route - requires authentication (middleware applied before handler)
app.use("/me", authenticate);
app.openapi(getMeRoute, UserController.getMe);

// Public routes
app.openapi(getAllUsersRoute, UserController.getAll);
app.openapi(getUserByIdRoute, UserController.getById);
app.openapi(createUserRoute, UserController.create);
app.openapi(updateUserRoute, UserController.update);
app.openapi(deleteUserRoute, UserController.delete);


export default app;
