import path from "node:path";

import { config } from "dotenv";
import { z } from "zod";

// Load .env from various possible locations
const pathsToTry = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
  path.resolve(__dirname, "..", "..", "..", ".env")
];

for (const envPath of pathsToTry) {
  config({ path: envPath, override: true });
}


const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().default("change-me"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("product-images"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional()
});

let parsedEnv: z.infer<typeof envSchema>;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  console.error("[env] ⚠️  Environment variable validation failed:", error);
  // Fall back to defaults so the server can at least start and return readable errors
  parsedEnv = envSchema.parse({});
}

export const env = parsedEnv;

