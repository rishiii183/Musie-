import type { MusicGraph } from "./musicGraph.types";
import { sampleMusicGraph } from "../data/sampleMusicGraph";
import { validateMusicGraph } from "./graphValidation";

export interface MusicDataProvider {
  getMusicGraph(): Promise<MusicGraph>;
}

export class DemoMusicDataProvider implements MusicDataProvider {
  async getMusicGraph(): Promise<MusicGraph> {
    // Simulated realistic async fetch
    await new Promise((resolve) => setTimeout(resolve, 80));
    const validation = validateMusicGraph(sampleMusicGraph);
    if (!validation.isValid) {
      console.warn("Demo graph validation warnings/errors:", validation.errors);
    }
    return validation.normalizedGraph;
  }
}

export const defaultDataProvider = new DemoMusicDataProvider();
