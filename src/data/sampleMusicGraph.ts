import type { MusicGraph } from "../domain/musicGraph.types";

/**
 * Cosmic sample graph tuned to match the organic nebula galaxy visual style.
 * Features vibrant color zones:
 * - Rose / Coral Red: Rap & Hip-Hop
 * - Sun Amber / Peach: Soul & Funk (Anderson .Paak)
 * - Magenta / Orchid: Tyler, The Creator & Alt R&B
 * - Violet / Pink: Psychedelic Pop (Tame Impala, Beach House)
 * - Mint / Emerald: Jazz (Miles Davis, Bill Evans)
 * - Ice Blue / Cobalt: Electronic & Ambient (Tycho, Bonobo, Boards of Canada)
 * - Diamond White / Silver: Modern Classical (Nils Frahm)
 */

interface RawNodeDef {
  id: string;
  type: "genre" | "artist" | "track";
  label: string;
  listeningCount: number;
  pos: [number, number, number];
  color: string;
  metadata?: Record<string, string | number | boolean | null>;
}

const rawNodes: RawNodeDef[] = [
  // ===================== HIP-HOP & RAP (Center / South) =====================
  { id: "artist-kendrick-lamar", type: "artist", label: "Kendrick Lamar", listeningCount: 310, pos: [0, 0, 0], color: "#ff6b81", metadata: { country: "United States", monthlyListeners: "28.9M" } },
  { id: "track-money-trees", type: "track", label: "Money Trees", listeningCount: 220, pos: [4, -5.5, 1], color: "#ff7979", metadata: { album: "good kid, m.A.A.d city", releaseYear: 2012, duration: "6:26" } },
  { id: "track-alright", type: "track", label: "Alright", listeningCount: 205, pos: [-3, 7.5, -1], color: "#ffffff", metadata: { album: "To Pimp a Butterfly", releaseYear: 2015, duration: "3:39" } },
  { id: "genre-rap", type: "genre", label: "rap", listeningCount: 360, pos: [-4, -12, 1], color: "#ff4757", metadata: { mood: "Raw & Story-Driven" } },
  { id: "genre-west-coast", type: "genre", label: "West Coast", listeningCount: 270, pos: [-9.5, -2.5, 2], color: "#ff9f43", metadata: { mood: "Laidback & Heavy Bass" } },
  { id: "genre-downtempo", type: "genre", label: "downtempo", listeningCount: 160, pos: [-3.5, -16.5, 2], color: "#70a1ff" },
  { id: "track-archie-marry-me", type: "track", label: "Archie, Marry Me", listeningCount: 110, pos: [-13.5, 0.5, 0], color: "#ffffff", metadata: { album: "Alvvays", releaseYear: 2014, duration: "3:16" } },
  { id: "artist-alvvays", type: "artist", label: "Alvvays", listeningCount: 140, pos: [-10, 4.5, -2], color: "#ffbe76" },

  // ===================== SOUL & FUNK (North-Center) =====================
  { id: "artist-anderson-paak", type: "artist", label: "Anderson .Paak", listeningCount: 260, pos: [2.5, 13.5, -1], color: "#f9ca24", metadata: { country: "United States", monthlyListeners: "14.2M" } },
  { id: "track-come-down", type: "track", label: "Come Down", listeningCount: 195, pos: [-4, 11.5, 1], color: "#7bed9f", metadata: { album: "Malibu", releaseYear: 2016, duration: "2:56" } },
  { id: "track-we-are-the-champions", type: "track", label: "Weird Fishes", listeningCount: 90, pos: [3.5, 7.5, 0], color: "#ffbe76" },
  { id: "track-feather", type: "track", label: "Feather", listeningCount: 125, pos: [9.5, 17.5, -1], color: "#c56cf0", metadata: { artist: "Nujabes", releaseYear: 2005 } },
  { id: "track-aruarian-dance", type: "track", label: "Aruarian Dance", listeningCount: 140, pos: [6.5, 6, 2], color: "#f8a5c2", metadata: { artist: "Nujabes" } },

  // ===================== TYLER, THE CREATOR & R&B (North-East) =====================
  { id: "artist-tyler-the-creator", type: "artist", label: "Tyler, The Creator", listeningCount: 285, pos: [12, 10, -1], color: "#ff9ff3", metadata: { country: "United States", monthlyListeners: "26.5M" } },
  { id: "track-earfquake", type: "track", label: "EARFQUAKE", listeningCount: 240, pos: [15, 18, 0], color: "#f368e0", metadata: { album: "IGOR", releaseYear: 2019, duration: "3:10" } },
  { id: "artist-frank-ocean", type: "artist", label: "Frank Ocean", listeningCount: 275, pos: [9.5, 7.5, -2], color: "#ffbe76", metadata: { country: "United States", monthlyListeners: "16.8M" } },
  { id: "track-thinkin-bout-you", type: "track", label: "Thinkin Bout You", listeningCount: 165, pos: [11.5, 4.5, 1], color: "#ffffff", metadata: { album: "channel ORANGE", releaseYear: 2012, duration: "3:20" } },
  { id: "genre-jazz-hop", type: "genre", label: "jazz", listeningCount: 230, pos: [12.5, 3, 2], color: "#c56cf0" },
  { id: "genre-chillhop", type: "genre", label: "chillhop", listeningCount: 155, pos: [13, 0.5, 0], color: "#1dd1a1" },

  // ===================== PSYCHEDELIC POP (North-West) =====================
  { id: "artist-tame-impala", type: "artist", label: "Tame Impala", listeningCount: 270, pos: [-8, 2, 0], color: "#f368e0", metadata: { country: "Australia", monthlyListeners: "15.4M" } },
  { id: "track-let-it-happen", type: "track", label: "Let It Happen", listeningCount: 190, pos: [-12, 1.5, -2], color: "#c56cf0", metadata: { album: "Currents", releaseYear: 2015, duration: "7:48" } },
  { id: "artist-beach-house", type: "artist", label: "Beach House", listeningCount: 175, pos: [-8, 7.5, -3], color: "#ff78c4", metadata: { country: "United States", monthlyListeners: "4.8M" } },
  { id: "track-space-song", type: "track", label: "Space Song", listeningCount: 185, pos: [-12, 9, 1], color: "#ffffff", metadata: { album: "Depression Cherry", releaseYear: 2015, duration: "5:20" } },
  { id: "genre-shoegaze", type: "genre", label: "shoegaze", listeningCount: 145, pos: [-5, 10, -2], color: "#e056fd" },
  { id: "genre-dream-pop", type: "genre", label: "dream pop", listeningCount: 160, pos: [-7, 14, -1], color: "#ff9ff3" },

  // ===================== SYNTHWAVE & CHILLWAVE (Center-South) =====================
  { id: "artist-the-midnight", type: "artist", label: "The Midnight", listeningCount: 155, pos: [-2, -4, 2], color: "#f368e0", metadata: { country: "United States" } },
  { id: "genre-synthwave", type: "genre", label: "synthwave", listeningCount: 220, pos: [1, -4.5, -1], color: "#c56cf0" },
  { id: "artist-com-truise", type: "artist", label: "Com Truise", listeningCount: 140, pos: [0, -8, 1], color: "#70a1ff" },
  { id: "track-silicon-tare", type: "track", label: "Silicon Tare", listeningCount: 95, pos: [0, -6.5, 0], color: "#dfe4ea" },
  { id: "genre-chillwave", type: "genre", label: "chillwave", listeningCount: 170, pos: [0, -9.5, -1], color: "#1dd1a1" },
  { id: "genre-electronic", type: "genre", label: "electronic", listeningCount: 290, pos: [3.5, -9, 0], color: "#c56cf0" },

  // ===================== AMBIENT & DOWNTEMPO (South-East) =====================
  { id: "artist-bonobo", type: "artist", label: "Bonobo", listeningCount: 190, pos: [1, -14, 0], color: "#c56cf0", metadata: { country: "United Kingdom" } },
  { id: "track-kerala", type: "track", label: "Kerala", listeningCount: 130, pos: [1, -17.5, 1], color: "#dfe4ea", metadata: { album: "Migration", releaseYear: 2017, duration: "3:57" } },
  { id: "artist-boards-of-canada", type: "artist", label: "Boards of Canada", listeningCount: 170, pos: [7, -15, -1], color: "#54a0ff", metadata: { country: "United Kingdom" } },
  { id: "track-daydreaming", type: "track", label: "Daydreaming", listeningCount: 145, pos: [5, -12, 1], color: "#ffffff", metadata: { artist: "Radiohead" } },
  { id: "artist-tycho", type: "artist", label: "Tycho", listeningCount: 180, pos: [5.5, -13.5, 2], color: "#ff9ff3", metadata: { country: "United States" } },
  { id: "track-awake", type: "track", label: "Awake", listeningCount: 135, pos: [3, -21, 0], color: "#ffffff", metadata: { album: "Awake", releaseYear: 2014 } },
  { id: "genre-ambient", type: "genre", label: "ambient", listeningCount: 250, pos: [9, -11, 0], color: "#70a1ff" },
  { id: "genre-idm", type: "genre", label: "idm", listeningCount: 180, pos: [8.5, -13, -2], color: "#5f27cd" },

  // ===================== MODERN CLASSICAL (East / South-East) =====================
  { id: "artist-nils-frahm", type: "artist", label: "Nils Frahm", listeningCount: 165, pos: [14.5, -9, -1], color: "#dfe4ea", metadata: { country: "Germany" } },
  { id: "track-says", type: "track", label: "Says", listeningCount: 140, pos: [18.5, -10.5, 1], color: "#ffffff", metadata: { album: "Spaces", releaseYear: 2013, duration: "8:18" } },
  { id: "genre-modern-classical", type: "genre", label: "modern classical", listeningCount: 195, pos: [14, -11.5, 0], color: "#dfe4ea" },
  { id: "artist-olafur-arnalds", type: "artist", label: "Ólafur Arnalds", listeningCount: 135, pos: [13, -6.5, 2], color: "#c8d6e5", metadata: { country: "Iceland" } },
  { id: "track-near-light", type: "track", label: "Near Light", listeningCount: 105, pos: [13, -5, 0], color: "#ffffff" },
  { id: "genre-classical", type: "genre", label: "classical", listeningCount: 210, pos: [13, -6, -1], color: "#ffffff" },

  // ===================== JAZZ & BEBOP (South-West) =====================
  { id: "artist-miles-davis", type: "artist", label: "Miles Davis", listeningCount: 225, pos: [-8, -15, 0], color: "#1dd1a1", metadata: { country: "United States" } },
  { id: "track-so-what", type: "track", label: "So What", listeningCount: 160, pos: [-12, -14, -1], color: "#ffffff", metadata: { album: "Kind of Blue", releaseYear: 1959, duration: "9:22" } },
  { id: "genre-cool-jazz", type: "genre", label: "cool jazz", listeningCount: 185, pos: [-9.5, -13.5, 2], color: "#2ed573" },
  { id: "genre-bebop", type: "genre", label: "bebop", listeningCount: 160, pos: [-7.5, -19, 1], color: "#10ac84" },
  { id: "artist-bill-evans", type: "artist", label: "Bill Evans", listeningCount: 145, pos: [-6, -13.5, -2], color: "#7bed9f" },
  { id: "track-waltz-for-debby", type: "track", label: "Waltz for Debby", listeningCount: 115, pos: [-5, -14, 0], color: "#ffffff" },
  { id: "genre-piano", type: "genre", label: "piano", listeningCount: 130, pos: [-5, -10.5, 1], color: "#2ed573" },
];

export const sampleMusicGraph: MusicGraph = {
  nodes: rawNodes.map((n) => ({
    id: n.id,
    type: n.type,
    label: n.label,
    listeningCount: n.listeningCount,
    position: n.pos,
    color: n.color,
    dataOrigin: "demo",
    metadata: n.metadata,
  })),
  edges: [
    // Kendrick Lamar connections
    { id: "e-k-rap", source: "artist-kendrick-lamar", target: "genre-rap", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-k-west", source: "artist-kendrick-lamar", target: "genre-west-coast", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-k-money", source: "artist-kendrick-lamar", target: "track-money-trees", type: "artist_track", dataOrigin: "demo" },
    { id: "e-k-alright", source: "artist-kendrick-lamar", target: "track-alright", type: "artist_track", dataOrigin: "demo" },
    { id: "e-k-mid", source: "artist-kendrick-lamar", target: "artist-the-midnight", type: "related_artist", dataOrigin: "demo" },

    // Anderson .Paak connections
    { id: "e-ap-alright", source: "artist-anderson-paak", target: "track-alright", type: "related_artist", dataOrigin: "demo" },
    { id: "e-ap-come", source: "artist-anderson-paak", target: "track-come-down", type: "artist_track", dataOrigin: "demo" },
    { id: "e-ap-ar", source: "artist-anderson-paak", target: "track-aruarian-dance", type: "artist_track", dataOrigin: "demo" },
    { id: "e-ap-f", source: "artist-anderson-paak", target: "track-feather", type: "artist_track", dataOrigin: "demo" },

    // Tyler, The Creator connections
    { id: "e-ty-earf", source: "artist-tyler-the-creator", target: "track-earfquake", type: "artist_track", dataOrigin: "demo" },
    { id: "e-ty-frank", source: "artist-tyler-the-creator", target: "artist-frank-ocean", type: "related_artist", dataOrigin: "demo" },
    { id: "e-fo-think", source: "artist-frank-ocean", target: "track-thinkin-bout-you", type: "artist_track", dataOrigin: "demo" },
    { id: "e-fo-jazz", source: "artist-frank-ocean", target: "genre-jazz-hop", type: "artist_genre", dataOrigin: "demo" },

    // Tame Impala & Beach House connections
    { id: "e-ti-let", source: "artist-tame-impala", target: "track-let-it-happen", type: "artist_track", dataOrigin: "demo" },
    { id: "e-ti-bh", source: "artist-tame-impala", target: "artist-beach-house", type: "related_artist", dataOrigin: "demo" },
    { id: "e-bh-space", source: "artist-beach-house", target: "track-space-song", type: "artist_track", dataOrigin: "demo" },
    { id: "e-bh-dream", source: "artist-beach-house", target: "genre-dream-pop", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-bh-shoe", source: "artist-beach-house", target: "genre-shoegaze", type: "artist_genre", dataOrigin: "demo" },

    // Ambient & Synthwave connections
    { id: "e-mid-synth", source: "artist-the-midnight", target: "genre-synthwave", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-com-sil", source: "artist-com-truise", target: "track-silicon-tare", type: "artist_track", dataOrigin: "demo" },
    { id: "e-com-chill", source: "artist-com-truise", target: "genre-chillwave", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-com-elec", source: "artist-com-truise", target: "genre-electronic", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-bon-ker", source: "artist-bonobo", target: "track-kerala", type: "artist_track", dataOrigin: "demo" },
    { id: "e-bon-amb", source: "artist-bonobo", target: "genre-ambient", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-ty-awake", source: "artist-tycho", target: "track-awake", type: "artist_track", dataOrigin: "demo" },
    { id: "e-boc-idm", source: "artist-boards-of-canada", target: "genre-idm", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-boc-day", source: "artist-boards-of-canada", target: "track-daydreaming", type: "artist_track", dataOrigin: "demo" },

    // Classical connections
    { id: "e-nf-says", source: "artist-nils-frahm", target: "track-says", type: "artist_track", dataOrigin: "demo" },
    { id: "e-nf-mod", source: "artist-nils-frahm", target: "genre-modern-classical", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-oa-near", source: "artist-olafur-arnalds", target: "track-near-light", type: "artist_track", dataOrigin: "demo" },
    { id: "e-oa-class", source: "artist-olafur-arnalds", target: "genre-classical", type: "artist_genre", dataOrigin: "demo" },

    // Jazz connections
    { id: "e-md-so", source: "artist-miles-davis", target: "track-so-what", type: "artist_track", dataOrigin: "demo" },
    { id: "e-md-cool", source: "artist-miles-davis", target: "genre-cool-jazz", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-md-bebop", source: "artist-miles-davis", target: "genre-bebop", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-be-waltz", source: "artist-bill-evans", target: "track-waltz-for-debby", type: "artist_track", dataOrigin: "demo" },
    { id: "e-be-piano", source: "artist-bill-evans", target: "genre-piano", type: "artist_genre", dataOrigin: "demo" },
    { id: "e-alv-arc", source: "artist-alvvays", target: "track-archie-marry-me", type: "artist_track", dataOrigin: "demo" },
  ],
};
