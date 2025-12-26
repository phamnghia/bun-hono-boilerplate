# Contributing to Bun-Hono Boilerplate

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bun-hono-boilerplate.git
   cd bun-hono-boilerplate
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Set up your environment**: Copy `.env.example` to `.env` and configure

## 📋 Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards (see below)

3. **Test your changes**:
   ```bash
   bun test
   ```

4. **Type check**:
   ```bash
   bun --bun tsc --noEmit
   ```

5. **Commit your changes** using conventional commits:
   ```bash
   git commit -m "feat: add new feature"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add user profile endpoint
fix: resolve authentication token expiry issue
docs: update API documentation
test: add tests for password hashing
```

## 🏗️ Code Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode in `tsconfig.json`
- Define interfaces for all data structures
- Use type inference where possible
- Avoid `any` types (use `unknown` if necessary)

### Code Organization

1. **Module Structure**: Follow the existing module pattern
   ```
   src/modules/[feature]/
   ├── [feature].controller.ts
   ├── [feature].routes.ts
   ├── [feature].service.ts
   └── schemas/
   ```

2. **Naming Conventions**:
   - Files: `kebab-case.ts`
   - Classes: `PascalCase`
   - Functions/Variables: `camelCase`
   - Constants: `UPPER_SNAKE_CASE`

3. **Imports**: Order imports by:
   - External packages
   - Internal modules
   - Types
   - Relative imports

### Error Handling

- Use custom error classes from `src/utils/errors.ts`
- Always handle errors appropriately
- Use try-catch for async operations
- Log errors with context

Example:
```typescript
try {
  const user = await UserService.create(data);
  logger.info("User created", { userId: user.id });
  return ok(c, user, SUCCESS_MESSAGES.USER_CREATED, 201);
} catch (error: any) {
  if (error.code === '23505') {
    throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  logger.error("Failed to create user", error);
  throw error;
}
```

### Security

- **Never** commit sensitive data (tokens, passwords, etc.)
- Always sanitize user inputs
- Use parameterized queries (Drizzle ORM handles this)
- Validate all inputs with Zod schemas
- Use rate limiting on public endpoints

## 🧪 Testing

### Writing Tests

1. Create test files in `src/__tests__/` directory
2. Name test files with `.test.ts` suffix
3. Use descriptive test names
4. Test both success and failure cases
5. Mock external dependencies

Example:
```typescript
import { describe, test, expect } from "bun:test";

describe("UserService", () => {
  test("should create a new user", async () => {
    // Arrange
    const userData = { email: "test@example.com", name: "Test User" };
    
    // Act
    const user = await UserService.create(userData);
    
    // Assert
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun run test:watch

# Run specific test file
bun test src/__tests__/password.test.ts
```

## 📝 Documentation

### Code Comments

- Write self-documenting code when possible
- Add comments for complex logic
- Document public APIs with JSDoc

Example:
```typescript
/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
}
```

### API Documentation

- Use OpenAPI schemas for all routes
- Provide example responses
- Document error cases
- Keep descriptions clear and concise

## 🐛 Reporting Issues

### Bug Reports

Include:
1. Clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details (Bun version, OS, etc.)
6. Error messages/logs if applicable

### Feature Requests

Include:
1. Clear description of the feature
2. Use case / motivation
3. Proposed solution (if any)
4. Alternative approaches considered

## 🔍 Code Review Process

1. All changes require a pull request
2. PRs should be small and focused
3. Ensure CI checks pass
4. Respond to review feedback promptly
5. Squash commits before merging

### Pull Request Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Type checking passes
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Commit messages follow convention
- [ ] No sensitive data included

## 🎯 Priority Areas

We especially welcome contributions in:
- Additional authentication methods (local, OAuth providers)
- More comprehensive test coverage
- Performance optimizations
- Documentation improvements
- Example implementations

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs via GitHub Issues
- **Discord/Slack**: [Link if available]

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to make this boilerplate better! 🙏
