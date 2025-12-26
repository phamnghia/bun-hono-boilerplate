import { createRoute, z } from "@hono/zod-openapi";
import { createErrorSchema, createResponseSchema } from "../../../utils/openapi";
import { CreateUserSchema, UpdateUserSchema, UserResponseSchema } from "./user.schema";

export const getMeRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createResponseSchema(UserResponseSchema, 'Current user retrieved successfully'),
        },
      },
      description: 'Get current authenticated user',
    },
    401: {
      content: {
        'application/json': {
          schema: createErrorSchema('Unauthorized'),
        },
      },
      description: 'Unauthorized',
    },
  },
})

export const getAllUsersRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createResponseSchema(z.array(UserResponseSchema), 'Users retrieved successfully'),
        },
      },
      description: 'Retrieve all users',
    },
  },
})

export const getUserByIdRoute = createRoute({
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
          schema: createResponseSchema(UserResponseSchema, 'User retrieved successfully'),
        },
      },
      description: 'Retrieve a user',
    },
    404: {
      content: {
        'application/json': {
          schema: createErrorSchema('User not found'),
        },
      },
      description: 'User not found',
    },
    400: {
      content: {
        'application/json': {
          schema: createErrorSchema('Invalid ID'),
        },
      },
      description: 'Invalid ID',
    },
  },
})

export const createUserRoute = createRoute({
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
          schema: createResponseSchema(UserResponseSchema, 'User created successfully'),
        },
      },
      description: 'Create a user',
    },
    409: {
      content: {
        'application/json': {
          schema: createErrorSchema('Email already exists'),
        },
      },
      description: 'Email already exists',
    },
    500: {
      content: {
        'application/json': {
          schema: createErrorSchema('Failed to create user'),
        },
      },
      description: 'Internal Server Error',
    },
  },
})

export const updateUserRoute = createRoute({
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
          schema: createResponseSchema(UserResponseSchema, 'User updated successfully'),
        },
      },
      description: 'Update a user',
    },
    404: {
      content: {
        'application/json': {
          schema: createErrorSchema('User not found'),
        },
      },
      description: 'User not found',
    },
    400: {
      content: {
        'application/json': {
          schema: createErrorSchema('Invalid ID'),
        },
      },
      description: 'Invalid ID',
    },
  },
})

export const deleteUserRoute = createRoute({
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
      content: {
        'application/json': {
          schema: createResponseSchema(z.null().optional(), 'User deleted successfully'),
        },
      },
      description: 'User deleted',
    },
    404: {
      content: {
        'application/json': {
          schema: createErrorSchema('User not found'),
        },
      },
      description: 'User not found',
    },
    400: {
      content: {
        'application/json': {
          schema: createErrorSchema('Invalid ID'),
        },
      },
      description: 'Invalid ID',
    },
  },
})
