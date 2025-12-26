# Use Bun official image
FROM oven/bun:1.3 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the app (if needed)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production image
FROM base AS production
ENV NODE_ENV=production

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/drizzle.config.ts ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]
