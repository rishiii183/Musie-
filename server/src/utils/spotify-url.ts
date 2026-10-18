export interface ParsedSpotifyPlaylist {
  isValid: boolean;
  playlistId: string | null;
  error?: string;
}

const PLAYLIST_ID_REGEX = /^[a-zA-Z0-9]{15,40}$/;

/**
 * Validates and extracts the playlist ID from Spotify URLs or URIs.
 * Prevents SSRF by strictly parsing without initiating arbitrary HTTP requests.
 */
export function parseSpotifyPlaylistUrl(rawInput: unknown): ParsedSpotifyPlaylist {
  if (typeof rawInput !== "string") {
    return {
      isValid: false,
      playlistId: null,
      error: "Playlist URL must be a non-empty string.",
    };
  }

  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      playlistId: null,
      error: "Please paste a Spotify playlist link.",
    };
  }

  // 1. Check for Spotify URI format (e.g. spotify:playlist:37i9dQZF1DXcBWIGoYBM5M)
  if (trimmed.startsWith("spotify:")) {
    const parts = trimmed.split(":");
    if (parts.length === 3) {
      const type = parts[1].toLowerCase();
      const id = parts[2].trim();

      if (type !== "playlist") {
        return {
          isValid: false,
          playlistId: null,
          error: `This is a Spotify ${type} URI. Please provide a Spotify playlist URI or link.`,
        };
      }

      if (!PLAYLIST_ID_REGEX.test(id)) {
        return {
          isValid: false,
          playlistId: null,
          error: "Invalid Spotify playlist ID in URI.",
        };
      }

      return {
        isValid: true,
        playlistId: id,
      };
    }

    return {
      isValid: false,
      playlistId: null,
      error: "Malformed Spotify URI format.",
    };
  }

  // 2. Parse Web URL format (e.g. https://open.spotify.com/playlist/...)
  let parsedUrl: URL;
  try {
    // If protocol is missing, try prepending https://
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch {
    return {
      isValid: false,
      playlistId: null,
      error: "Invalid URL format. Please provide a valid open.spotify.com playlist URL.",
    };
  }

  // Validate hostname strictly against Spotify domains
  const host = parsedUrl.hostname.toLowerCase();
  const allowedHosts = ["open.spotify.com", "play.spotify.com"];
  if (!allowedHosts.includes(host)) {
    return {
      isValid: false,
      playlistId: null,
      error: "Invalid host. URL must originate from open.spotify.com.",
    };
  }

  // Extract path components: e.g. /playlist/37i9dQZF1DXcBWIGoYBM5M or /intl-de/playlist/...
  const segments = parsedUrl.pathname
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  // Check if internationalized prefix exists (e.g., /intl-en/playlist/...)
  let typeIndex = 0;
  if (segments.length >= 2 && segments[0].startsWith("intl-")) {
    typeIndex = 1;
  }

  if (segments.length < typeIndex + 2) {
    return {
      isValid: false,
      playlistId: null,
      error: "URL does not point to a specific Spotify item.",
    };
  }

  const resourceType = segments[typeIndex].toLowerCase();
  const candidateId = segments[typeIndex + 1];

  if (resourceType === "track") {
    return {
      isValid: false,
      playlistId: null,
      error: "This is a Spotify track link. Please provide a Spotify playlist link instead.",
    };
  }

  if (resourceType === "album") {
    return {
      isValid: false,
      playlistId: null,
      error: "This is a Spotify album link. Please provide a Spotify playlist link instead.",
    };
  }

  if (resourceType === "artist") {
    return {
      isValid: false,
      playlistId: null,
      error: "This is a Spotify artist link. Please provide a Spotify playlist link instead.",
    };
  }

  if (resourceType !== "playlist") {
    return {
      isValid: false,
      playlistId: null,
      error: `Unsupported resource type '${resourceType}'. Please provide a Spotify playlist link.`,
    };
  }

  if (!PLAYLIST_ID_REGEX.test(candidateId)) {
    return {
      isValid: false,
      playlistId: null,
      error: "Invalid Spotify playlist ID format in URL.",
    };
  }

  return {
    isValid: true,
    playlistId: candidateId,
  };
}
