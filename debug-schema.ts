import { z } from "zod";
import { CreateUserSchema } from "./src/modules/user/schemas/user.schema";
import { createRoute } from "@hono/zod-openapi";

console.log("CreateUserSchema:", CreateUserSchema);
console.log("Is ZodSchema:", CreateUserSchema instanceof z.ZodType);

const route = createRoute({
  method: 'post',
  path: '/',
  responses: {
    200: {
      description: 'test'
    }
  },
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema
        }
      }
    }
  }
});

console.log("Route Config Body Schema:", route.request?.body?.content['application/json'].schema);
