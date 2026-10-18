import type { MusicGraph, MusicNode, MusicEdge } from "../domain/musicGraph.types";

/**
 * High-fidelity demo music graph with 7 genres, 15 artists, and 36 tracks.
 * All positions are arranged in spatial constellations around genre superclusters.
 * All nodes and edges include dataOrigin: "demo" as required by docs/data-model.md.
 */

// Helper to calculate orbital positions around a center
function orbit(
  cx: number,
  cy: number,
  cz: number,
  radius: number,
  angleIndex: number,
  totalItems: number,
  elevationOffset: number = 0
): [number, number, number] {
  const theta = (angleIndex / totalItems) * Math.PI * 2;
  const x = cx + radius * Math.cos(theta);
  const z = cz + radius * Math.sin(theta);
  const y = cy + elevationOffset + (angleIndex % 2 === 0 ? 1.5 : -1.5);
  return [Number(x.toFixed(2)), Number(y.toFixed(2)), Number(z.toFixed(2))];
}

// 1. Genres (Superclusters)
const genres: MusicNode[] = [
  {
    id: "genre-psychedelic-pop",
    type: "genre",
    label: "Psychedelic Pop",
    listeningCount: 380,
    position: [-22, 6, -10],
    dataOrigin: "demo",
    metadata: {
      description: "Dreamy analog textures, swirling synths, and shimmering vocal hooks.",
      mood: "Ethereal & Euphoric",
      topYear: "2015-2023",
    },
  },
  {
    id: "genre-indie-rock",
    type: "genre",
    label: "Indie Rock",
    listeningCount: 420,
    position: [18, 10, -18],
    dataOrigin: "demo",
    metadata: {
      description: "Driving post-punk guitars, introspective lyrics, and gritty rhythm sections.",
      mood: "Energetic & Nostalgic",
      topYear: "2006-2022",
    },
  },
  {
    id: "genre-electronic",
    type: "genre",
    label: "French Electronic",
    listeningCount: 350,
    position: [24, -8, 12],
    dataOrigin: "demo",
    metadata: {
      description: "Filtered disco samples, compression sidechains, and analog synthesizers.",
      mood: "Electrifying & Rhythmic",
      topYear: "2001-2016",
    },
  },
  {
    id: "genre-neo-soul",
    type: "genre",
    label: "Neo-Soul & R&B",
    listeningCount: 390,
    position: [-16, -12, 18],
    dataOrigin: "demo",
    metadata: {
      description: "Lush vocal harmonies, 808 sub-bass, and emotional lyrical vulnerability.",
      mood: "Sensual & Reflective",
      topYear: "2016-2024",
    },
  },
  {
    id: "genre-synthwave",
    type: "genre",
    label: "Ambient & Synthwave",
    listeningCount: 260,
    position: [-4, 20, 16],
    dataOrigin: "demo",
    metadata: {
      description: "Cinematic retro-futurism, tape warmth, and slow-blooming melodies.",
      mood: "Meditative & Atmospheric",
      topYear: "2011-2021",
    },
  },
  {
    id: "genre-hip-hop",
    type: "genre",
    label: "Modern Hip-Hop",
    listeningCount: 460,
    position: [2, -18, -14],
    dataOrigin: "demo",
    metadata: {
      description: "Sharp poetic cadence, cinematic string arrangements, and punchy drum breaks.",
      mood: "Raw & Story-Driven",
      topYear: "2012-2024",
    },
  },
  {
    id: "genre-jazz-fusion",
    type: "genre",
    label: "Jazz Fusion",
    listeningCount: 220,
    position: [0, 2, -28],
    dataOrigin: "demo",
    metadata: {
      description: "Polyrhythmic brass arrangements, virtuoso solos, and harmonic exploration.",
      mood: "Complex & Transcendent",
      topYear: "2014-2023",
    },
  },
];

// 2. Artists
interface ArtistDef {
  id: string;
  label: string;
  listeningCount: number;
  genreId: string;
  pos: [number, number, number];
  followers: string;
  country: string;
}

const artistDefs: ArtistDef[] = [
  // Psychedelic Pop
  {
    id: "artist-tame-impala",
    label: "Tame Impala",
    listeningCount: 248,
    genreId: "genre-psychedelic-pop",
    pos: [-28, 4, -6],
    followers: "15.4M",
    country: "Australia",
  },
  {
    id: "artist-beach-house",
    label: "Beach House",
    listeningCount: 164,
    genreId: "genre-psychedelic-pop",
    pos: [-18, 11, -15],
    followers: "4.8M",
    country: "United States",
  },

  // Indie Rock
  {
    id: "artist-arctic-monkeys",
    label: "Arctic Monkeys",
    listeningCount: 275,
    genreId: "genre-indie-rock",
    pos: [14, 15, -14],
    followers: "24.1M",
    country: "United Kingdom",
  },
  {
    id: "artist-the-strokes",
    label: "The Strokes",
    listeningCount: 195,
    genreId: "genre-indie-rock",
    pos: [25, 8, -16],
    followers: "9.2M",
    country: "United States",
  },
  {
    id: "artist-phoenix",
    label: "Phoenix",
    listeningCount: 130,
    genreId: "genre-indie-rock",
    pos: [18, 5, -24],
    followers: "3.1M",
    country: "France",
  },

  // French Electronic
  {
    id: "artist-daft-punk",
    label: "Daft Punk",
    listeningCount: 290,
    genreId: "genre-electronic",
    pos: [20, -5, 18],
    followers: "18.3M",
    country: "France",
  },
  {
    id: "artist-justice",
    label: "Justice",
    listeningCount: 145,
    genreId: "genre-electronic",
    pos: [31, -12, 8],
    followers: "2.7M",
    country: "France",
  },

  // Neo-Soul & R&B
  {
    id: "artist-frank-ocean",
    label: "Frank Ocean",
    listeningCount: 260,
    genreId: "genre-neo-soul",
    pos: [-22, -16, 14],
    followers: "16.8M",
    country: "United States",
  },
  {
    id: "artist-sza",
    label: "SZA",
    listeningCount: 280,
    genreId: "genre-neo-soul",
    pos: [-10, -9, 22],
    followers: "21.5M",
    country: "United States",
  },

  // Ambient & Synthwave
  {
    id: "artist-tycho",
    label: "Tycho",
    listeningCount: 155,
    genreId: "genre-synthwave",
    pos: [-9, 24, 12],
    followers: "1.9M",
    country: "United States",
  },
  {
    id: "artist-kavinsky",
    label: "Kavinsky",
    listeningCount: 138,
    genreId: "genre-synthwave",
    pos: [2, 17, 21],
    followers: "2.4M",
    country: "France",
  },

  // Modern Hip-Hop
  {
    id: "artist-kendrick-lamar",
    label: "Kendrick Lamar",
    listeningCount: 310,
    genreId: "genre-hip-hop",
    pos: [-4, -22, -11],
    followers: "28.9M",
    country: "United States",
  },
  {
    id: "artist-j-cole",
    label: "J. Cole",
    listeningCount: 215,
    genreId: "genre-hip-hop",
    pos: [9, -15, -18],
    followers: "20.2M",
    country: "United States",
  },

  // Jazz Fusion
  {
    id: "artist-kamasi-washington",
    label: "Kamasi Washington",
    listeningCount: 125,
    genreId: "genre-jazz-fusion",
    pos: [-5, 6, -32],
    followers: "890K",
    country: "United States",
  },
  {
    id: "artist-snarky-puppy",
    label: "Snarky Puppy",
    listeningCount: 110,
    genreId: "genre-jazz-fusion",
    pos: [6, -2, -26],
    followers: "750K",
    country: "United States",
  },
];

const artists: MusicNode[] = artistDefs.map((a) => ({
  id: a.id,
  type: "artist",
  label: a.label,
  listeningCount: a.listeningCount,
  position: a.pos,
  dataOrigin: "demo",
  metadata: {
    country: a.country,
    monthlyListeners: a.followers,
    primaryGenre: a.genreId,
  },
}));

// 3. Tracks (36 tracks orbiting their parent artist)
interface TrackDef {
  id: string;
  label: string;
  artistId: string;
  listeningCount: number;
  album: string;
  year: number;
  duration: string;
}

const trackDefs: TrackDef[] = [
  // Tame Impala
  { id: "track-let-it-happen", label: "Let It Happen", artistId: "artist-tame-impala", listeningCount: 88, album: "Currents", year: 2015, duration: "7:48" },
  { id: "track-the-less-i-know", label: "The Less I Know The Better", artistId: "artist-tame-impala", listeningCount: 96, album: "Currents", year: 2015, duration: "3:36" },
  { id: "track-borderline", label: "Borderline", artistId: "artist-tame-impala", listeningCount: 64, album: "The Slow Rush", year: 2020, duration: "3:57" },

  // Beach House
  { id: "track-space-song", label: "Space Song", artistId: "artist-beach-house", listeningCount: 92, album: "Depression Cherry", year: 2015, duration: "5:20" },
  { id: "track-myth", label: "Myth", artistId: "artist-beach-house", listeningCount: 72, album: "Bloom", year: 2012, duration: "4:18" },

  // Arctic Monkeys
  { id: "track-do-i-wanna-know", label: "Do I Wanna Know?", artistId: "artist-arctic-monkeys", listeningCount: 104, album: "AM", year: 2013, duration: "4:32" },
  { id: "track-505", label: "505", artistId: "artist-arctic-monkeys", listeningCount: 89, album: "Favourite Worst Nightmare", year: 2007, duration: "4:13" },
  { id: "track-r-u-mine", label: "R U Mine?", artistId: "artist-arctic-monkeys", listeningCount: 82, album: "AM", year: 2013, duration: "3:21" },

  // The Strokes
  { id: "track-last-nite", label: "Last Nite", artistId: "artist-the-strokes", listeningCount: 74, album: "Is This It", year: 2001, duration: "3:13" },
  { id: "track-reptilia", label: "Reptilia", artistId: "artist-the-strokes", listeningCount: 68, album: "Room on Fire", year: 2003, duration: "3:39" },
  { id: "track-the-adults-are-talking", label: "The Adults Are Talking", artistId: "artist-the-strokes", listeningCount: 53, album: "The New Abnormal", year: 2020, duration: "5:09" },

  // Phoenix
  { id: "track-1901", label: "1901", artistId: "artist-phoenix", listeningCount: 66, album: "Wolfgang Amadeus Phoenix", year: 2009, duration: "3:13" },
  { id: "track-lisztomania", label: "Lisztomania", artistId: "artist-phoenix", listeningCount: 64, album: "Wolfgang Amadeus Phoenix", year: 2009, duration: "4:01" },

  // Daft Punk
  { id: "track-get-lucky", label: "Get Lucky", artistId: "artist-daft-punk", listeningCount: 112, album: "Random Access Memories", year: 2013, duration: "6:09" },
  { id: "track-harder-better", label: "Harder, Better, Faster, Stronger", artistId: "artist-daft-punk", listeningCount: 95, album: "Discovery", year: 2001, duration: "3:44" },
  { id: "track-one-more-time", label: "One More Time", artistId: "artist-daft-punk", listeningCount: 83, album: "Discovery", year: 2001, duration: "5:20" },

  // Justice
  { id: "track-dance", label: "D.A.N.C.E.", artistId: "artist-justice", listeningCount: 78, album: "† (Cross)", year: 2007, duration: "4:02" },
  { id: "track-genesis", label: "Genesis", artistId: "artist-justice", listeningCount: 67, album: "† (Cross)", year: 2007, duration: "3:54" },

  // Frank Ocean
  { id: "track-pink-white", label: "Pink + White", artistId: "artist-frank-ocean", listeningCount: 94, album: "Blonde", year: 2016, duration: "3:04" },
  { id: "track-nights", label: "Nights", artistId: "artist-frank-ocean", listeningCount: 88, album: "Blonde", year: 2016, duration: "5:07" },
  { id: "track-lost", label: "Lost", artistId: "artist-frank-ocean", listeningCount: 78, album: "channel ORANGE", year: 2012, duration: "3:54" },

  // SZA
  { id: "track-snooze", label: "Snooze", artistId: "artist-sza", listeningCount: 108, album: "SOS", year: 2022, duration: "3:21" },
  { id: "track-kill-bill", label: "Kill Bill", artistId: "artist-sza", listeningCount: 99, album: "SOS", year: 2022, duration: "2:33" },
  { id: "track-good-days", label: "Good Days", artistId: "artist-sza", listeningCount: 73, album: "SOS", year: 2022, duration: "4:39" },

  // Tycho
  { id: "track-awake", label: "Awake", artistId: "artist-tycho", listeningCount: 56, album: "Awake", year: 2014, duration: "4:43" },
  { id: "track-a-walk", label: "A Walk", artistId: "artist-tycho", listeningCount: 54, album: "Dive", year: 2011, duration: "5:16" },
  { id: "track-epoch", label: "Epoch", artistId: "artist-tycho", listeningCount: 45, album: "Epoch", year: 2016, duration: "5:45" },

  // Kavinsky
  { id: "track-nightcall", label: "Nightcall", artistId: "artist-kavinsky", listeningCount: 84, album: "OutRun", year: 2013, duration: "4:19" },
  { id: "track-pacific-coast", label: "Pacific Coast Highway", artistId: "artist-kavinsky", listeningCount: 54, album: "OutRun", year: 2013, duration: "6:23" },

  // Kendrick Lamar
  { id: "track-humble", label: "HUMBLE.", artistId: "artist-kendrick-lamar", listeningCount: 115, album: "DAMN.", year: 2017, duration: "2:57" },
  { id: "track-money-trees", label: "Money Trees", artistId: "artist-kendrick-lamar", listeningCount: 102, album: "good kid, m.A.A.d city", year: 2012, duration: "6:26" },
  { id: "track-all-the-stars", label: "All The Stars", artistId: "artist-kendrick-lamar", listeningCount: 93, album: "Black Panther: The Album", year: 2018, duration: "3:52" },

  // J. Cole
  { id: "track-no-role-modelz", label: "No Role Modelz", artistId: "artist-j-cole", listeningCount: 110, album: "2014 Forest Hills Drive", year: 2014, duration: "4:52" },
  { id: "track-middle-child", label: "MIDDLE CHILD", artistId: "artist-j-cole", listeningCount: 86, album: "Revenge of the Dreamers III", year: 2019, duration: "3:33" },

  // Kamasi Washington
  { id: "track-fists-of-fury", label: "Fists of Fury", artistId: "artist-kamasi-washington", listeningCount: 48, album: "Heaven and Earth", year: 2018, duration: "9:42" },
  { id: "track-street-fighter-mas", label: "Street Fighter Mas", artistId: "artist-kamasi-washington", listeningCount: 42, album: "Heaven and Earth", year: 2018, duration: "5:57" },

  // Snarky Puppy
  { id: "track-lingus", label: "Lingus", artistId: "artist-snarky-puppy", listeningCount: 65, album: "We Like It Here", year: 2014, duration: "10:45" },
  { id: "track-shofukan", label: "Shofukan", artistId: "artist-snarky-puppy", listeningCount: 45, album: "We Like It Here", year: 2014, duration: "6:33" },
];

// Compute track positions around their artist
const artistPosMap = new Map<string, [number, number, number]>();
for (const a of artistDefs) {
  artistPosMap.set(a.id, a.pos);
}

// Track grouping by artist
const tracksByArtist = new Map<string, TrackDef[]>();
for (const t of trackDefs) {
  const list = tracksByArtist.get(t.artistId) || [];
  list.push(t);
  tracksByArtist.set(t.artistId, list);
}

const tracks: MusicNode[] = [];
tracksByArtist.forEach((tracksList, artistId) => {
  const parentPos = artistPosMap.get(artistId) || [0, 0, 0];
  tracksList.forEach((t, idx) => {
    const pos = orbit(parentPos[0], parentPos[1], parentPos[2], 4.2, idx, tracksList.length, (idx - 1) * 0.8);
    tracks.push({
      id: t.id,
      type: "track",
      label: t.label,
      listeningCount: t.listeningCount,
      position: pos,
      dataOrigin: "demo",
      metadata: {
        album: t.album,
        releaseYear: t.year,
        duration: t.duration,
        parentArtist: artistId,
      },
    });
  });
});

// 4. Edges
const edges: MusicEdge[] = [];

// Artist -> Genre edges
for (const a of artistDefs) {
  edges.push({
    id: `edge-${a.id}-${a.genreId}`,
    source: a.id,
    target: a.genreId,
    type: "artist_genre",
    dataOrigin: "demo",
  });
}

// Artist -> Track edges
for (const t of trackDefs) {
  edges.push({
    id: `edge-${t.artistId}-${t.id}`,
    source: t.artistId,
    target: t.id,
    type: "artist_track",
    dataOrigin: "demo",
  });
}

// Curated related_artist edges (explicitly marked with dataOrigin: "demo")
const relatedArtistPairs: [string, string][] = [
  ["artist-tame-impala", "artist-beach-house"],
  ["artist-arctic-monkeys", "artist-the-strokes"],
  ["artist-the-strokes", "artist-phoenix"],
  ["artist-daft-punk", "artist-justice"],
  ["artist-frank-ocean", "artist-sza"],
  ["artist-tycho", "artist-kavinsky"],
  ["artist-kendrick-lamar", "artist-j-cole"],
  ["artist-kamasi-washington", "artist-snarky-puppy"],
  // Cross-pollination links
  ["artist-tame-impala", "artist-daft-punk"],
  ["artist-kendrick-lamar", "artist-kamasi-washington"], // Kamasi played saxophone on 'To Pimp A Butterfly'
];

relatedArtistPairs.forEach(([source, target], idx) => {
  edges.push({
    id: `edge-rel-${source}-${target}-${idx}`,
    source,
    target,
    type: "related_artist",
    confidence: 0.85,
    dataOrigin: "demo",
  });
});

export const sampleMusicGraph: MusicGraph = {
  nodes: [...genres, ...artists, ...tracks],
  edges,
};
