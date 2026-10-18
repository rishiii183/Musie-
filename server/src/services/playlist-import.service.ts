import { env } from "../config/env.js";
import { parseSpotifyPlaylistUrl } from "../utils/spotify-url.js";
import { SpotifyService, defaultSpotifyService } from "./spotify.service.js";
import { buildMusicGraphFromSpotify } from "./graph-builder.service.js";
import type {
  SpotifyPlaylistImportResponse,
  SpotifyTrack,
} from "../types/music.types.js";

export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class PlaylistImportService {
  private spotifyService: SpotifyService;
  private maxTracks: number;

  constructor(spotifyService = defaultSpotifyService, maxTracks = env.MAX_PLAYLIST_TRACKS) {
    this.spotifyService = spotifyService;
    this.maxTracks = maxTracks;
  }

  async importPlaylist(rawUrl: string): Promise<SpotifyPlaylistImportResponse> {
    // 1. Validate & extract Spotify Playlist ID (SSRF-safe)
    const parsed = parseSpotifyPlaylistUrl(rawUrl);
    if (!parsed.isValid || !parsed.playlistId) {
      throw new ValidationError(parsed.error ?? "Invalid Spotify playlist URL.");
    }

    const playlistId = parsed.playlistId;

    // 2. Fetch Playlist header and first track batch
    const playlistMeta = await this.spotifyService.getPlaylist(playlistId);

    const allTracks: SpotifyTrack[] = [];
    const firstItems = playlistMeta.tracks?.items ?? [];

    for (const item of firstItems) {
      if (item.track) {
        allTracks.push(item.track);
      }
    }

    // 3. Paginate subsequent track batches if playlist has more tracks
    const totalTracksInPlaylist = playlistMeta.tracks?.total ?? allTracks.length;
    let offset = firstItems.length;
    const limit = 50;

    while (allTracks.length < totalTracksInPlaylist && allTracks.length < this.maxTracks) {
      const pageLimit = Math.min(limit, this.maxTracks - allTracks.length);
      const page = await this.spotifyService.getPlaylistTracksPage(playlistId, offset, pageLimit);

      if (!page.items || page.items.length === 0) {
        break;
      }

      for (const item of page.items) {
        if (item.track) {
          allTracks.push(item.track);
        }
      }

      offset += page.items.length;
    }

    const isTruncated = totalTracksInPlaylist > this.maxTracks;

    // 4. Batch fetch artist genres (optional enrichment for top artists)
    const uniqueArtistIds = Array.from(
      new Set(
        allTracks
          .flatMap((t) => t.artists?.map((a) => a.id) ?? [])
          .filter((id): id is string => Boolean(id))
      )
    );

    const artistGenresMap = await this.spotifyService.getArtistGenres(uniqueArtistIds);

    // 5. Build normalized celestial graph
    const { graph, stats, warnings } = buildMusicGraphFromSpotify(allTracks, artistGenresMap);

    if (isTruncated) {
      warnings.push(
        `Playlist contains ${totalTracksInPlaylist} tracks. Galaxy generation was capped at the ${this.maxTracks} most prominent tracks for optimal 3D performance.`
      );
    }

    // 6. Format playlist cover image
    const images = playlistMeta.images ?? [];
    const imageUrl = images[0]?.url ?? null;

    return {
      source: "spotify",
      playlist: {
        id: playlistMeta.id,
        name: playlistMeta.name || "Untitled Playlist",
        description: playlistMeta.description || null,
        externalUrl:
          playlistMeta.external_urls?.spotify ?? `https://open.spotify.com/playlist/${playlistMeta.id}`,
        imageUrl,
        totalTracks: totalTracksInPlaylist,
      },
      stats: {
        ...stats,
        truncated: isTruncated,
      },
      graph,
      warnings,
    };
  }
}

export const defaultPlaylistImportService = new PlaylistImportService();
