# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-26

### 🎉 Major Refactor - Production-Ready Boilerplate

This release represents a complete overhaul of the boilerplate with focus on production readiness, security, and developer experience.

### Added

#### Phase 1: Code Quality & Structure
- **Environment Validation**: Zod-based validation for all environment variables with startup validation
- **Configuration Management**: Centralized configuration in `src/config/` (app.ts, env.ts)
- **Error Handling**: Custom error classes (AppError, NotFoundError, UnauthorizedError, etc.)
- **Logging System**: Structured logging with environment-aware configuration
- **Removed unused files**: Cleaned up debug-schema.ts and root index.ts

#### Phase 2: Architecture Improvements
- **Standardized Module Structure**: Consistent routes → controller → service pattern
- **Auth Controller**: Added missing controller layer to auth module for consistency
- **JWT Middleware**: `authenticate` and `optionalAuthenticate` middleware for route protection
- **Error Handler Middleware**: Global error handling middleware
- **Types Directory**: Shared TypeScript types and interfaces in `src/types/`
- **Constants**: Application-wide constants for messages and HTTP status codes

#### Phase 3: Security & Best Practices
- **Password Hashing**: Utilities using Bun's native bcrypt implementation
- **Rate Limiting**: Configurable rate limiting with separate limits for auth endpoints
- **Security Headers**: Comprehensive security headers (CSP, HSTS, XSS protection, etc.)
- **Input Sanitization**: XSS prevention utilities (HTML escaping, URL sanitization, email validation)
- **Protected Routes**: Example implementation with `/users/me` endpoint
- **CORS Configuration**: Environment-based CORS policies

#### Phase 4: Developer Experience
- **Testing Infrastructure**: Complete test setup with bun:test
  - 19 passing tests covering utilities (password, sanitization, errors)
  - Test scripts in package.json
- **Comprehensive Documentation**:
  - README.md (250+ lines) with quick start, architecture overview, and examples
  - ARCHITECTURE.md (450+ lines) with detailed technical documentation
  - CONTRIBUTING.md with contribution guidelines and code standards
- **OpenAPI Documentation**: Auto-generated API docs with security schemes

#### Phase 5: Performance & Maintenance
- **Prettier Configuration**: Code formatting configuration
- **Docker Support**: Complete Docker setup with Dockerfile and docker-compose.yml
- **GitHub Actions CI/CD**: Automated testing, type checking, and Docker builds
- **VSCode Configuration**: Recommended extensions and workspace settings
- **Package Scripts**: Comprehensive npm scripts for common tasks
- **Enhanced .gitignore**: More comprehensive ignore patterns

### Changed
- **Response Format**: Standardized response format with `ok()` and `fail()` helpers
- **Auth Service**: Updated to use centralized config and structured logging
- **User Controller**: Refactored to use custom error classes and constants
- **Database Connection**: Now uses centralized configuration
- **Main Entry Point**: Enhanced with security middleware and better organization

### Security
- JWT authentication with configurable secret (minimum 32 characters enforced)
- Rate limiting on all endpoints (stricter on auth routes)
- Security headers added globally
- Input sanitization utilities for XSS prevention
- Password hashing with bcrypt
- Environment variable validation prevents insecure defaults

### Developer Experience Improvements
- Type-safe configuration management
- Consistent error handling across the application
- Clear separation of concerns
- Comprehensive documentation
- Testing infrastructure in place
- Docker support for easy deployment
- CI/CD pipeline ready to use

### Performance
- Stateless design for horizontal scaling
- Efficient database queries with Drizzle ORM
- Proper indexing on email and googleId fields
- Environment-aware logging (no debug logs in production)

## [1.0.0] - Initial Release

### Added
- Basic Bun + Hono setup
- User module with CRUD operations
- Google OAuth authentication
- Drizzle ORM with PostgreSQL
- OpenAPI documentation with Scalar UI
- Basic environment configuration

---

For upgrade instructions and breaking changes, please refer to the [Migration Guide](./MIGRATION.md) (when applicable).
