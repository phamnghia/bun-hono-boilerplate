import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long")
    .refine(
      (val) => {
        // Check for sufficient entropy: no repeated patterns, mix of characters
        const hasVariety = /[a-z]/.test(val) && /[A-Z]/.test(val) && /[0-9]/.test(val);
        const noRepeats = !/(.)\1{4,}/.test(val); // No character repeated more than 4 times
        return hasVariety && noRepeats;
      },
      {
        message:
          "JWT_SECRET must contain uppercase, lowercase, and numbers, and avoid repeated patterns",
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
