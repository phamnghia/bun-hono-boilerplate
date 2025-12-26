import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long")
    .refine(
      (val) => {
        // Check for sufficient entropy: mix of character types and no repeated patterns
        const hasLowercase = /[a-z]/.test(val);
        const hasUppercase = /[A-Z]/.test(val);
        const hasNumbers = /[0-9]/.test(val);
        const hasSpecial = /[^a-zA-Z0-9]/.test(val);
        const noRepeats = !/(.)\1{4,}/.test(val); // No character repeated >4 times
        
        // Require at least 3 of 4 character types
        const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;
        
        return varietyCount >= 3 && noRepeats;
      },
      {
        message:
          "JWT_SECRET must contain at least 3 of: uppercase, lowercase, numbers, special characters. Avoid repeated patterns.",
      }
    ),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  PORT: z.string().default("3000").transform(Number),
  BASE_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();
