import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_KEY: z.string().min(1, 'API_KEY is required'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  MCP_STDIO: z.string().default('0').transform((val: string) => val === '1'),
  LOG_LEVEL: z.string().default('info'),
});

export const env = envSchema.parse(process.env);
