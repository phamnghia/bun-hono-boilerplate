# Architecture Documentation

This document provides a detailed overview of the architectural decisions, patterns, and structure of the Bun-Hono API Boilerplate.

## 🏛️ Architecture Overview

This boilerplate follows a **modular, layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         HTTP Request                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Middleware Layer            │
│  - CORS                             │
│  - Security Headers                 │
│  - Rate Limiting                    │
│  - Authentication (JWT)             │
│  - Error Handling                   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Routes Layer                │
│  - OpenAPI Definitions              │
│  - Request Validation (Zod)         │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│        Controller Layer             │
│  - Request/Response Handling        │
│  - Business Logic Coordination      │
│  - Error Transformation             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Service Layer               │
│  - Business Logic                   │
│  - Data Manipulation                │
│  - External API Calls               │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Data Access Layer              │
│  - Database Operations (Drizzle)    │
│  - Query Building                   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│          Database                   │
│      (PostgreSQL)                   │
└─────────────────────────────────────┘
```

## 📁 Directory Structure

### `/src/config`
**Purpose**: Centralized configuration management

- `env.ts`: Environment variable validation using Zod
- `app.ts`: Application-wide configuration derived from env vars

**Design Decisions**:
- Validate all environment variables at startup to fail fast
- Use Zod for runtime type safety
- Provide sensible defaults where appropriate

### `/src/middleware`
**Purpose**: Cross-cutting concerns that apply to multiple routes

- `auth.ts`: JWT authentication and authorization
- `error-handler.ts`: Global error handling
- `rate-limit.ts`: Rate limiting implementation
- `security.ts`: Security headers

**Design Decisions**:
- Middleware should be composable and reusable
- Each middleware has a single responsibility
- Middleware should not contain business logic

### `/src/modules`
**Purpose**: Feature-based code organization

Each module follows this structure:
```
module-name/
├── module-name.controller.ts  # Request handling
├── module-name.routes.ts      # Route definitions
├── module-name.service.ts     # Business logic
└── schemas/
    ├── module-name.schema.ts  # Data schemas
    └── route.schema.ts        # OpenAPI route schemas
```

**Design Decisions**:
- **Routes**: Define HTTP endpoints and OpenAPI documentation
- **Controllers**: Handle HTTP concerns (request/response)
- **Services**: Contain business logic and data operations
- **Schemas**: Zod schemas for validation and type inference

### `/src/utils`
**Purpose**: Shared utility functions

- `errors.ts`: Custom error classes
- `logger.ts`: Structured logging
- `password.ts`: Password hashing utilities
- `response.ts`: Standardized response formatting
- `sanitize.ts`: Input sanitization

**Design Decisions**:
- Utilities should be pure functions when possible
- No business logic in utilities
- Each utility should be independently testable

### `/src/types`
**Purpose**: Shared TypeScript types and interfaces

**Design Decisions**:
- Define interfaces for data structures
- Re-export commonly used types
- Keep types close to their usage when possible

### `/src/constants`
**Purpose**: Application-wide constants

**Design Decisions**:
- Use `as const` for immutability
- Group related constants
- Prevent magic numbers/strings in code

## 🔄 Request Flow

### 1. Incoming Request
```
HTTP Request → Hono Router → Middleware Chain → Route Handler
```

### 2. Middleware Chain
```
CORS → Security Headers → Logger → Rate Limiter → Auth (if protected) → Error Handler
```

### 3. Route Processing
```
Route → Schema Validation → Controller → Service → Database → Response
```

### 4. Response Flow
```
Data → Service → Controller → Response Formatter → HTTP Response
```

## 🎯 Design Patterns

### 1. **Module Pattern**
Each feature is self-contained with its own routes, controllers, and services.

**Benefits**:
- Easy to understand and maintain
- Clear boundaries between features
- Facilitates parallel development
- Makes testing easier

### 2. **Dependency Injection**
Services are passed to controllers, making them testable.

```typescript
// Service defines the operations
export const UserService = {
  async getById(id: number) { ... }
};

// Controller uses the service
export const UserController = {
  async getById(c: Context) {
    const user = await UserService.getById(id);
    return ok(c, user);
  }
};
```

### 3. **Factory Pattern**
Used for creating response schemas and error responses.

```typescript
export const createResponseSchema = <T>(schema: T, message: string) => {
  return z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: schema,
  });
};
```

### 4. **Middleware Pattern**
Cross-cutting concerns implemented as composable middleware.

```typescript
app.use("*", securityHeaders);
app.use("*", apiRateLimit);
app.use("/protected", authenticate);
```

## 🔐 Security Architecture

### Authentication Flow

```
1. User → /auth/google → Google OAuth
2. Google → /auth/google/callback → JWT Token
3. Client → Protected Route + JWT → Verify → Access Granted/Denied
```

### Security Layers

1. **Transport Security**: HTTPS in production
2. **Input Validation**: Zod schemas on all inputs
3. **Authentication**: JWT tokens with secure secrets
4. **Authorization**: Middleware-based access control
5. **Rate Limiting**: Per-route rate limits
6. **Security Headers**: CSP, HSTS, XSS protection
7. **Input Sanitization**: XSS prevention utilities

## 📊 Data Flow

### Read Operation
```
Request → Validation → Controller → Service → DB Query → Transform → Response
```

### Write Operation
```
Request → Validation → Sanitization → Controller → Service → 
DB Transaction → Audit Log → Response
```

## 🧪 Testing Strategy

### Unit Tests
- Test individual functions in isolation
- Mock external dependencies
- Focus on business logic

### Integration Tests
- Test multiple layers together
- Use test database
- Verify end-to-end functionality

### Test Structure
```
describe("Feature", () => {
  describe("specific function", () => {
    test("should handle success case", () => { ... });
    test("should handle error case", () => { ... });
  });
});
```

## 🔄 Error Handling Strategy

### Error Hierarchy
```
Error (Built-in)
└── AppError (Custom base)
    ├── BadRequestError (400)
    ├── UnauthorizedError (401)
    ├── ForbiddenError (403)
    ├── NotFoundError (404)
    ├── ConflictError (409)
    └── TooManyRequestsError (429)
```

### Error Flow
```
throw CustomError → Error Handler Middleware → 
Log Error → Format Response → Send to Client
```

## 📝 Logging Strategy

### Log Levels
- **debug**: Development debugging
- **info**: Normal operations
- **warn**: Warning conditions
- **error**: Error conditions

### What to Log
- **info**: Successful operations, user actions
- **warn**: Deprecated features, slow queries
- **error**: Exceptions, failures, security events

### What NOT to Log
- Passwords or secrets
- Personal data (PII)
- Full credit card numbers
- JWT tokens

## 🚀 Performance Considerations

### Database
- Use connection pooling
- Index frequently queried columns
- Use prepared statements (Drizzle handles this)
- Avoid N+1 queries

### API
- Implement caching where appropriate
- Use pagination for large datasets
- Optimize payload sizes
- Enable compression

### Security vs Performance
- Rate limiting prevents abuse but adds overhead
- JWT verification adds latency but ensures security
- Input validation prevents attacks but requires processing

## 🔧 Configuration Management

### Environment-based Config
```
Development → Relaxed security, verbose logging
Production → Strict security, minimal logging
Test → In-memory DB, no external calls
```

### Configuration Validation
All configuration is validated at startup using Zod schemas, ensuring:
- Required values are present
- Values have correct types
- Values meet constraints (min length, format, etc.)

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless API design (no session storage in memory)
- JWT tokens are self-contained
- Rate limiting uses in-memory store (use Redis for production)

### Vertical Scaling
- Efficient database queries
- Minimal memory footprint
- Fast response times with Bun runtime

## 🎓 Best Practices

1. **Keep It Simple**: Prefer simple solutions over complex ones
2. **Fail Fast**: Validate early, fail early
3. **Be Explicit**: Prefer explicit over implicit
4. **Type Safety**: Use TypeScript's type system fully
5. **Error Handling**: Handle errors at appropriate levels
6. **Testing**: Write tests for critical paths
7. **Documentation**: Document complex logic and APIs
8. **Security**: Security is not optional

## 🔮 Future Enhancements

Potential architectural improvements:
- Event-driven architecture with message queues
- Microservices decomposition for large apps
- CQRS pattern for complex domains
- GraphQL layer for flexible queries
- Redis for caching and rate limiting
- WebSocket support for real-time features

---

This architecture provides a solid foundation for building scalable, maintainable APIs while following industry best practices.
