import { config } from "dotenv";
import { z } from "zod";

config({ path: "../.env" });

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

export const env = envSchema.parse(process.env);
