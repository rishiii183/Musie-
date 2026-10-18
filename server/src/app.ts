import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.routes.js";
import { playlistRouter } from "./routes/playlist.routes.js";
import { apiLimiter } from "./middleware/rate-limit.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

// Security: Disable X-Powered-By header
app.disable("x-powered-by");

// CORS configuration restricted to frontend origins
app.use(
  cors({
    origin: [env.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing with safe size limit
app.use(express.json({ limit: "100kb" }));

// Mount health routes
app.use("/api/health", healthRouter);

// Mount playlist routes with rate limiting on import
app.use("/api/playlists", apiLimiter, playlistRouter);

// Catch-all 404 handler for undefined API routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Centralized error handling
app.use(errorHandler);
