import type { MusicGraph } from "./musicGraph.types";
import type { MusicDataProvider } from "./musicDataProvider";
import { validateMusicGraph } from "./graphValidation";
import type { SpotifyPlaylistMeta, SpotifyImportStats } from "../services/spotifyImportApi";

export class SpotifyMusicDataProvider implements MusicDataProvider {
  private graph: MusicGraph;
  readonly playlist: SpotifyPlaylistMeta;
  readonly stats: SpotifyImportStats;
  readonly warnings: string[];

  constructor(
    graph: MusicGraph,
    playlist: SpotifyPlaylistMeta,
    stats: SpotifyImportStats,
    warnings: string[] = []
  ) {
    const validated = validateMusicGraph(graph);
    this.graph = validated.normalizedGraph;
    this.playlist = playlist;
    this.stats = stats;
    this.warnings = warnings;
  }

  async getMusicGraph(): Promise<MusicGraph> {
    return this.graph;
  }
}
