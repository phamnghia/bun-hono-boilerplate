import { UserController } from "./user.controller";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";

import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { UserSchema } from "./user.schema";

const app = new OpenAPIHono();

app.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Users'],
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: z.array(UserSchema),
                    },
                },
                description: 'Retrieve all users',
            },
        },
    }),
    UserController.getAll
);

app.openapi(
    createRoute({
        method: 'get',
        path: '/{id}',
        tags: ['Users'],
        request: {
            params: z.object({
                id: z.string().transform((v) => Number(v)).openapi({ param: { name: 'id', in: 'path' }, type: 'integer' }),
            }),
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: UserSchema,
                    },
                },
                description: 'Retrieve a user',
            },
            404: {
                description: 'User not found',
            },
        },
    }),
    UserController.getById
);

app.openapi(
    createRoute({
        method: 'post',
        path: '/',
        tags: ['Users'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateUserSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: UserSchema,
                    },
                },
                description: 'Create a user',
            },
        },
    }),
    UserController.create
);

app.openapi(
    createRoute({
        method: 'put',
        path: '/{id}',
        tags: ['Users'],
        request: {
            params: z.object({
                id: z.string().transform((v) => Number(v)).openapi({ param: { name: 'id', in: 'path' }, type: 'integer' }),
            }),
            body: {
                content: {
                    'application/json': {
                        schema: UpdateUserSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: UserSchema,
                    },
                },
                description: 'Update a user',
            },
        },
    }),
    UserController.update
);

app.openapi(
    createRoute({
        method: 'delete',
        path: '/{id}',
        tags: ['Users'],
        request: {
            params: z.object({
                id: z.string().transform((v) => Number(v)).openapi({ param: { name: 'id', in: 'path' }, type: 'integer' }),
            }),
        },
        responses: {
            200: {
                description: 'User deleted',
            },
        },
    }),
    UserController.delete
);

export default app;
