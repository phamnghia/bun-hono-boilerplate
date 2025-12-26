# Bun + Hono API Boilerplate

A production-ready, well-structured API boilerplate built with [Bun](https://bun.sh) and [Hono](https://hono.dev), featuring authentication, security best practices, and comprehensive developer experience.

## ✨ Features

### 🏗️ Architecture
- **Clean Architecture**: Organized in modules with separation of concerns (routes → controllers → services)
- **Type-Safe**: Full TypeScript support with strict type checking
- **OpenAPI Documentation**: Auto-generated API docs with Scalar UI
- **Environment Validation**: Runtime environment variable validation with Zod

### 🔐 Security
- **JWT Authentication**: Secure token-based authentication with middleware
- **Password Hashing**: Built-in bcrypt hashing with Bun's native API
- **Rate Limiting**: Configurable rate limiting per route
- **Security Headers**: Comprehensive security headers (CSP, HSTS, XSS protection, etc.)
- **Input Sanitization**: XSS prevention and HTML escaping utilities
- **CORS**: Configurable CORS policies

### 🛠️ Developer Experience
- **Hot Reload**: Fast development with `--watch` mode
- **Testing**: Built-in test infrastructure with `bun:test`
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Structured logging with environment-aware configuration
- **Code Organization**: Consistent module structure across the codebase

### 📦 Tech Stack
- **Runtime**: Bun v1.3+
- **Framework**: Hono v4
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas
- **Documentation**: OpenAPI 3.0 with Scalar

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) v1.3 or higher
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bun-hono-boilerplate
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV="development"
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
PORT="3000"
BASE_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

4. Run database migrations:
```bash
bun run drizzle-kit migrate
```

5. Start the development server:
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, visit:
- **API Docs**: http://localhost:3000/docs
- **OpenAPI Spec**: http://localhost:3000/api-specs
- **LLM-friendly docs**: http://localhost:3000/llms.txt

## 🗂️ Project Structure

```
src/
├── config/           # Configuration management
│   ├── app.ts       # Application configuration
│   └── env.ts       # Environment validation
├── constants/        # Application constants
│   └── index.ts     # Error messages, status codes, etc.
├── db/              # Database setup
│   ├── index.ts     # Drizzle configuration
│   └── schema.ts    # Database schemas
├── middleware/      # Middleware functions
│   ├── auth.ts      # JWT authentication
│   ├── error-handler.ts  # Global error handler
│   ├── rate-limit.ts     # Rate limiting
│   └── security.ts       # Security headers
├── modules/         # Feature modules
│   ├── auth/        # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   └── user/        # User module
│       ├── schemas/
│       │   ├── route.schema.ts
│       │   └── user.schema.ts
│       ├── user.controller.ts
│       ├── user.routes.ts
│       └── user.service.ts
├── types/           # Shared TypeScript types
│   └── index.ts
├── utils/           # Utility functions
│   ├── errors.ts    # Custom error classes
│   ├── logger.ts    # Logging utility
│   ├── openapi.ts   # OpenAPI helpers
│   ├── password.ts  # Password hashing
│   ├── response.ts  # Response formatters
│   └── sanitize.ts  # Input sanitization
├── __tests__/       # Test files
└── index.ts         # Application entry point
```

## 🧪 Testing

Run tests:
```bash
bun test
```

Run tests in watch mode:
```bash
bun run test:watch
```

## 🔒 Authentication

### Google OAuth

1. Navigate to `/auth/google` to initiate Google OAuth flow
2. After successful authentication, you'll receive a JWT token
3. Use the token in the `Authorization` header for protected routes:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/users/me
```

### Protected Routes Example

```typescript
// In your routes file
import { authenticate } from "../../middleware/auth";

// Apply authentication middleware
app.use("/me", authenticate);
app.openapi(getMeRoute, UserController.getMe);
```

## 🛡️ Security Features

### Rate Limiting

```typescript
import { rateLimit, authRateLimit } from "./middleware/rate-limit";

// Custom rate limit
const customLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

app.use("/api/*", customLimit);
```

### Input Sanitization

```typescript
import { escapeHtml, sanitizeEmail } from "./utils/sanitize";

const cleanInput = escapeHtml(userInput);
const validEmail = sanitizeEmail(email);
```

### Password Hashing

```typescript
import { hashPassword, verifyPassword } from "./utils/password";

// Hash a password
const hash = await hashPassword("password123");

// Verify a password
const isValid = await verifyPassword("password123", hash);
```

## 📝 Creating a New Module

1. Create a new directory in `src/modules/`:
```bash
mkdir -p src/modules/posts
```

2. Create the module files:
```
src/modules/posts/
├── posts.controller.ts  # Business logic handlers
├── posts.routes.ts      # Route definitions
├── posts.service.ts     # Database operations
└── schemas/
    ├── post.schema.ts   # Zod schemas
    └── route.schema.ts  # OpenAPI route schemas
```

3. Register routes in `src/index.ts`:
```typescript
import postRoutes from "./modules/posts/posts.routes";
app.route("/posts", postRoutes);
```

## 🔧 Configuration

### Environment Variables

All environment variables are validated at startup using Zod schemas. See `src/config/env.ts` for the complete schema.

### Application Configuration

Centralized configuration is available in `src/config/app.ts`:

```typescript
import { appConfig } from "./config/app";

console.log(appConfig.isDevelopment); // boolean
console.log(appConfig.auth.jwtSecret); // string
```

## 📊 Database Migrations

Generate a new migration:
```bash
bun run drizzle-kit generate
```

Apply migrations:
```bash
bun run drizzle-kit migrate
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass: `bun test`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Hono](https://hono.dev) - Lightweight web framework
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Zod](https://zod.dev) - Schema validation

---

Built with ❤️ using Bun and Hono
