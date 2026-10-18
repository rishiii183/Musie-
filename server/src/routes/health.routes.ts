import { Router } from "express";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "musie-api",
  });
});

healthRouter.get("/spotify", (_req, res) => {
  res.status(200).json({
    status: "ok",
    spotifyConfigured: env.isSpotifyConfigured,
  });
});
