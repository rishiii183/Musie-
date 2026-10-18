import { Router } from "express";
import { defaultPlaylistController } from "../controllers/playlist.controller.js";

export const playlistRouter = Router();

playlistRouter.post("/import", defaultPlaylistController.importPlaylist);
playlistRouter.get("/:playlistId", defaultPlaylistController.getPlaylistById);
