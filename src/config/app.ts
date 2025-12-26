import { env } from "./env";

export const appConfig = {
  port: env.PORT,
  baseUrl: env.BASE_URL,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
  
  // API Configuration
  api: {
    version: "1.0.0",
    title: "Bun Hono API",
    prefix: "/api",
  },
  
  // CORS Configuration
  cors: {
    origin: env.NODE_ENV === "production" 
      ? [env.BASE_URL] 
      : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
  
  // Auth Configuration
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: "7d",
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackPath: "/auth/google/callback",
    },
  },
  
  // Database Configuration
  database: {
    url: env.DATABASE_URL,
  },
} as const;
