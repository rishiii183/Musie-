import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`🌌 Musie Backend API running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(
    `   Spotify Integration: ${
      env.isSpotifyConfigured ? "Configured (Active)" : "Missing credentials in .env"
    }`
  );
});

// Graceful termination handling
const shutdown = () => {
  console.log("Shutting down Musie API server...");
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
