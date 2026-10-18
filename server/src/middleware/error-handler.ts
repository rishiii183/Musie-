import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { SpotifyError } from "../services/spotify.service.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const message = firstIssue ? firstIssue.message : "Invalid request data.";
    res.status(400).json({ error: message, details: err.format() });
    return;
  }

  // 2. Spotify Domain Errors
  if (err instanceof SpotifyError) {
    if (err.retryAfterSeconds) {
      res.setHeader("Retry-After", err.retryAfterSeconds);
    }
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // 3. Validation & Client Errors
  if (err instanceof Error) {
    const statusCode = (err as any).statusCode;
    if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
      res.status(statusCode).json({ error: err.message });
      return;
    }

    const isClientError =
      err.message.includes("Invalid Spotify playlist") ||
      err.message.includes("Please paste a Spotify") ||
      err.message.includes("URL must originate") ||
      err.message.includes("Spotify track link") ||
      err.message.includes("Spotify album link") ||
      err.message.includes("Spotify artist link");

    const status = isClientError ? 400 : 500;
    res.status(status).json({ error: err.message });
    return;
  }

  // 4. Unknown Fallback
  res.status(500).json({ error: "An unexpected server error occurred." });
}
