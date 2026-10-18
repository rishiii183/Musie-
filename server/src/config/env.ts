import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  SPOTIFY_CLIENT_ID: z.string().optional().default(""),
  SPOTIFY_CLIENT_SECRET: z.string().optional().default(""),
  MAX_PLAYLIST_TRACKS: z.coerce.number().min(1).max(2000).default(500),
  API_RATE_LIMIT_MAX: z.coerce.number().default(60),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid server environment configuration:", parsed.error.format());
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isSpotifyConfigured: Boolean(
    parsed.data.SPOTIFY_CLIENT_ID &&
    parsed.data.SPOTIFY_CLIENT_SECRET &&
    parsed.data.SPOTIFY_CLIENT_ID.trim().length > 0 &&
    parsed.data.SPOTIFY_CLIENT_SECRET.trim().length > 0
  ),
};
