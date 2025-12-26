import { OpenAPIHono } from "@hono/zod-openapi";
import { validationErrorResponse } from "../../utils/response";
import { UserController } from "./user.controller";
import { createUserRoute, deleteUserRoute, getAllUsersRoute, getUserByIdRoute, updateUserRoute } from "./schemas/route.schema";
import { errorHandler } from "../../middleware/error-handler";

const app = new OpenAPIHono({
    defaultHook: validationErrorResponse,
});

// Apply error handler middleware
app.use("*", errorHandler);

app.openapi(getAllUsersRoute, UserController.getAll);
app.openapi(getUserByIdRoute, UserController.getById);
app.openapi(createUserRoute, UserController.create);
app.openapi(updateUserRoute, UserController.update);
app.openapi(deleteUserRoute, UserController.delete);


export default app;
