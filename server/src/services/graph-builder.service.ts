import type {
  MusicGraph,
  MusicNode,
  MusicEdge,
  SpotifyTrack,
} from "../types/music.types.js";

const GALAXY_COLOR_PALETTES = [
  { primary: "#ff6b81", secondary: "#ff7979", light: "#ffffff" }, // Rose / Coral
  { primary: "#ff9f43", secondary: "#feca57", light: "#ffffff" }, // Amber / Sun
  { primary: "#f368e0", secondary: "#ff9ff3", light: "#ffffff" }, // Magenta / Orchid
  { primary: "#38bdf8", secondary: "#70a1ff", light: "#ffffff" }, // Electric Cyan
  { primary: "#1dd1a1", secondary: "#10ac84", light: "#ffffff" }, // Mint / Emerald
  { primary: "#a855f7", secondary: "#c084fc", light: "#ffffff" }, // Celestial Purple
  { primary: "#54a0ff", secondary: "#2e86de", light: "#ffffff" }, // Ice Blue
  { primary: "#dfe4ea", secondary: "#c8d6e5", light: "#ffffff" }, // Diamond Silver
];

export interface GraphBuilderResult {
  graph: MusicGraph;
  stats: {
    tracksProcessed: number;
    tracksSkipped: number;
    artistsProcessed: number;
    genresAvailable: number;
  };
  warnings: string[];
}

export function formatTrackDuration(durationMs?: number): string {
  if (!durationMs || durationMs <= 0) return "0:00";
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * Builds a normalized 3D celestial MusicGraph from Spotify tracks.
 * - Deduplicates artists and tracks by stable Spotify ID.
 * - Sizing reflects playlist composition.
 * - Arranges nodes into a celestial logarithmic spiral galaxy with orbital clusters.
 */
export function buildMusicGraphFromSpotify(
  rawTracks: SpotifyTrack[],
  artistGenresMap: Map<string, string[]> = new Map()
): GraphBuilderResult {
  const warnings: string[] = [];
  let tracksSkipped = 0;

  // 1. Filter valid tracks
  const validTracks: SpotifyTrack[] = [];
  for (const track of rawTracks) {
    if (!track || !track.id || track.is_local) {
      tracksSkipped++;
      continue;
    }
    validTracks.push(track);
  }

  // 2. Count artist frequencies and collect track occurrences
  const artistMap = new Map<
    string,
    {
      id: string;
      name: string;
      externalUrl?: string;
      trackCount: number;
      tracks: string[];
    }
  >();

  const trackOccurrenceMap = new Map<string, { track: SpotifyTrack; count: number }>();

  for (const track of validTracks) {
    const existing = trackOccurrenceMap.get(track.id);
    if (existing) {
      existing.count += 1;
    } else {
      trackOccurrenceMap.set(track.id, { track, count: 1 });
    }

    const artists = track.artists ?? [];
    if (artists.length === 0) {
      warnings.push(`Track '${track.name}' has no credited artists.`);
      continue;
    }

    for (const artist of artists) {
      if (!artist.id || !artist.name) continue;
      const artistData = artistMap.get(artist.id);
      if (artistData) {
        artistData.trackCount += 1;
        artistData.tracks.push(track.id);
      } else {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          externalUrl: artist.external_urls?.spotify,
          trackCount: 1,
          tracks: [track.id],
        });
      }
    }
  }

  // 3. Sort artists by track count to position prominent artists near spiral arm centers
  const sortedArtists = Array.from(artistMap.values()).sort(
    (a, b) => b.trackCount - a.trackCount
  );

  const artistNodeMap = new Map<string, MusicNode>();
  const artistPositions = new Map<string, [number, number, number]>();

  const numSpiralArms = 3;
  const totalArtists = Math.max(1, sortedArtists.length);

  sortedArtists.forEach((artist, index) => {
    const palette = GALAXY_COLOR_PALETTES[index % GALAXY_COLOR_PALETTES.length];
    const armIndex = index % numSpiralArms;

    // Logarithmic spiral math: r = a * exp(b * theta)
    const normRank = index / totalArtists;
    const radius = 3.5 + 18.5 * Math.sqrt(normRank);
    const armBaseAngle = (armIndex * 2 * Math.PI) / numSpiralArms;
    const spiralAngle = armBaseAngle + 1.45 * Math.log(1 + radius);
    const verticalOffset = Math.sin(spiralAngle * 2.2) * 2.4 * (1 - normRank * 0.4);

    const pos: [number, number, number] = [
      Math.round((radius * Math.cos(spiralAngle) + (Math.sin(index * 7) * 0.8)) * 10) / 10,
      Math.round(verticalOffset * 10) / 10,
      Math.round((radius * Math.sin(spiralAngle) + (Math.cos(index * 5) * 0.8)) * 10) / 10,
    ];

    artistPositions.set(artist.id, pos);

    const genres = artistGenresMap.get(artist.id) ?? [];

    const artistNode: MusicNode = {
      id: `spotify:artist:${artist.id}`,
      type: "artist",
      label: artist.name,
      listeningCount: 100 + artist.trackCount * 35, // Scaled weight for visualization
      externalUrl: artist.externalUrl,
      color: palette.primary,
      position: pos,
      dataOrigin: "spotify",
      metadata: {
        spotifyId: artist.id,
        playlistTrackCount: artist.trackCount,
        genres: genres.length > 0 ? genres.join(", ") : null,
      },
    };

    artistNodeMap.set(artist.id, artistNode);
  });

  // 4. Generate Track Nodes & Edges
  const trackNodes: MusicNode[] = [];
  const edges: MusicEdge[] = [];
  const edgeIdSet = new Set<string>();

  const addEdge = (source: string, target: string, type: MusicEdge["type"]) => {
    const edgeId = `edge-${type}-${source}-${target}`;
    if (!edgeIdSet.has(edgeId) && source !== target) {
      edgeIdSet.add(edgeId);
      edges.push({
        id: edgeId,
        source,
        target,
        type,
        dataOrigin: "spotify",
      });
    }
  };

  // Group tracks by primary artist to place in orbital rings
  const artistTrackBuckets = new Map<string, Array<{ track: SpotifyTrack; count: number }>>();
  for (const { track, count } of trackOccurrenceMap.values()) {
    const primaryArtistId = track.artists?.[0]?.id ?? "unknown";
    const bucket = artistTrackBuckets.get(primaryArtistId) ?? [];
    bucket.push({ track, count });
    artistTrackBuckets.set(primaryArtistId, bucket);
  }

  for (const [artistId, bucket] of artistTrackBuckets.entries()) {
    const parentArtist = artistNodeMap.get(artistId);
    const parentPos = artistPositions.get(artistId) ?? [0, 0, 0];
    const artistIndex = sortedArtists.findIndex((a) => a.id === artistId);
    const palette =
      GALAXY_COLOR_PALETTES[(artistIndex >= 0 ? artistIndex : 0) % GALAXY_COLOR_PALETTES.length];

    bucket.forEach((item, trackIdx) => {
      const track = item.track;
      const trackNodeId = `spotify:track:${track.id}`;

      // Distribute tracks in orbiting rings around their primary artist star
      const orbitRing = Math.floor(trackIdx / 4);
      const ringIndex = trackIdx % 4;
      const orbitRadius = 1.8 + orbitRing * 1.2;
      const angle = (ringIndex * 2 * Math.PI) / 4 + trackIdx * 0.35;
      const orbitHeight = (Math.sin(angle * 3) * 0.7);

      const trackPos: [number, number, number] = [
        Math.round((parentPos[0] + Math.cos(angle) * orbitRadius) * 10) / 10,
        Math.round((parentPos[1] + orbitHeight) * 10) / 10,
        Math.round((parentPos[2] + Math.sin(angle) * orbitRadius) * 10) / 10,
      ];

      const durationStr = formatTrackDuration(track.duration_ms);
      const albumImages = track.album?.images ?? [];
      const imageUrl = albumImages[albumImages.length - 1]?.url ?? albumImages[0]?.url;

      const trackNode: MusicNode = {
        id: trackNodeId,
        type: "track",
        label: track.name,
        listeningCount: 60 + item.count * 20,
        imageUrl,
        externalUrl: track.external_urls?.spotify,
        color: palette.secondary,
        position: trackPos,
        dataOrigin: "spotify",
        metadata: {
          spotifyId: track.id,
          album: track.album?.name ?? "Unknown Album",
          releaseYear: track.album?.release_date ? track.album.release_date.slice(0, 4) : null,
          duration: durationStr,
          artists: track.artists?.map((a) => a.name).join(", ") ?? "",
        },
      };

      trackNodes.push(trackNode);

      // Connect track to each credited artist
      const artists = track.artists ?? [];
      artists.forEach((artist) => {
        if (artist.id) {
          addEdge(`spotify:artist:${artist.id}`, trackNodeId, "artist_track");
        }
      });

      // Connect collaborating artists on this track
      if (artists.length > 1) {
        for (let i = 0; i < artists.length; i++) {
          for (let j = i + 1; j < artists.length; j++) {
            if (artists[i].id && artists[j].id) {
              addEdge(
                `spotify:artist:${artists[i].id}`,
                `spotify:artist:${artists[j].id}`,
                "related_artist"
              );
            }
          }
        }
      }
    });
  }

  // 5. Generate Genre Nodes & Edges (if genres are discovered)
  const genreNodes: MusicNode[] = [];
  const genreSet = new Map<string, { name: string; artistIds: string[] }>();

  for (const [artistId, genres] of artistGenresMap.entries()) {
    if (!artistNodeMap.has(artistId)) continue;
    for (const genreName of genres) {
      const slug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = genreSet.get(slug);
      if (existing) {
        existing.artistIds.push(artistId);
      } else {
        genreSet.set(slug, { name: genreName, artistIds: [artistId] });
      }
    }
  }

  // Limit to top 15 most prominent genres in the playlist
  const sortedGenres = Array.from(genreSet.entries())
    .sort((a, b) => b[1].artistIds.length - a[1].artistIds.length)
    .slice(0, 15);

  sortedGenres.forEach(([slug, genreInfo], idx) => {
    const genreNodeId = `genre:${slug}`;
    // Position genres on outer celestial halo
    const angle = (idx * 2 * Math.PI) / Math.max(1, sortedGenres.length);
    const radius = 22 + (idx % 3) * 3;
    const pos: [number, number, number] = [
      Math.round(Math.cos(angle) * radius * 10) / 10,
      Math.round(Math.sin(angle * 2) * 4 * 10) / 10,
      Math.round(Math.sin(angle) * radius * 10) / 10,
    ];

    genreNodes.push({
      id: genreNodeId,
      type: "genre",
      label: genreInfo.name,
      listeningCount: 120 + genreInfo.artistIds.length * 25,
      color: "#ffffff",
      position: pos,
      dataOrigin: "spotify",
      metadata: {
        artistsCount: genreInfo.artistIds.length,
      },
    });

    for (const artistId of genreInfo.artistIds) {
      addEdge(`spotify:artist:${artistId}`, genreNodeId, "artist_genre");
    }
  });

  const allNodes: MusicNode[] = [
    ...artistNodeMap.values(),
    ...trackNodes,
    ...genreNodes,
  ];

  return {
    graph: {
      nodes: allNodes,
      edges,
    },
    stats: {
      tracksProcessed: trackNodes.length,
      tracksSkipped,
      artistsProcessed: artistNodeMap.size,
      genresAvailable: genreNodes.length,
    },
    warnings,
  };
}
