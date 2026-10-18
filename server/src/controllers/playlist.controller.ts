import type { Request, Response, NextFunction } from "express";
import { importPlaylistSchema } from "../schemas/playlist.schema.js";
import { defaultPlaylistImportService, PlaylistImportService } from "../services/playlist-import.service.js";

export class PlaylistController {
  private importService: PlaylistImportService;

  constructor(importService = defaultPlaylistImportService) {
    this.importService = importService;
  }

  importPlaylist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedBody = importPlaylistSchema.parse(req.body);
      const result = await this.importService.importPlaylist(parsedBody.url);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPlaylistById = async (req: Request, res: Response): Promise<void> => {
    const playlistId = req.params.playlistId;
    res.status(404).json({
      error: `Playlist lookup for '${playlistId}' is not persisted. Use POST /api/playlists/import with the full Spotify playlist URL to generate the 3D galaxy.`,
    });
  };
}

export const defaultPlaylistController = new PlaylistController();
