import { describe, it, expect } from "vitest";
import { parseSpotifyPlaylistUrl } from "../src/utils/spotify-url.js";

describe("Spotify URL Parser and Validator", () => {
  it("parses standard Spotify playlist URL", () => {
    const input = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(true);
    expect(result.playlistId).toBe("37i9dQZF1DXcBWIGoYBM5M");
    expect(result.error).toBeUndefined();
  });

  it("parses Spotify playlist URL with query parameters", () => {
    const input = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=ab12cd34ef56&utm_source=copy-link";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(true);
    expect(result.playlistId).toBe("37i9dQZF1DXcBWIGoYBM5M");
  });

  it("parses internationalized Spotify playlist URLs", () => {
    const input = "https://open.spotify.com/intl-de/playlist/37i9dQZF1DXcBWIGoYBM5M";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(true);
    expect(result.playlistId).toBe("37i9dQZF1DXcBWIGoYBM5M");
  });

  it("parses Spotify URI format", () => {
    const input = "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(true);
    expect(result.playlistId).toBe("37i9dQZF1DXcBWIGoYBM5M");
  });

  it("trims whitespace from input", () => {
    const input = "   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M   \n";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(true);
    expect(result.playlistId).toBe("37i9dQZF1DXcBWIGoYBM5M");
  });

  it("rejects empty or non-string input", () => {
    expect(parseSpotifyPlaylistUrl("").isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl("   ").isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl(null).isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl(undefined).isValid).toBe(false);
  });

  it("rejects Spotify track URLs with helpful message", () => {
    const input = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("This is a Spotify track link");
  });

  it("rejects Spotify album URLs with helpful message", () => {
    const input = "https://open.spotify.com/album/4eLPsYPBmXABThSJ821sqY";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("This is a Spotify album link");
  });

  it("rejects Spotify artist URLs with helpful message", () => {
    const input = "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("This is a Spotify artist link");
  });

  it("rejects non-playlist Spotify URIs", () => {
    const input = "spotify:track:4cOdK2wGLETKBW3PvgPWqT";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Spotify track URI");
  });

  it("rejects unrelated hosts and hostile SSRF attempts", () => {
    expect(parseSpotifyPlaylistUrl("https://evil.com/playlist/37i9dQZF1DXcBWIGoYBM5M").isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl("http://localhost:3000/playlist/12345678901234567890").isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl("http://169.254.169.254/latest/meta-data").isValid).toBe(false);
    expect(parseSpotifyPlaylistUrl("https://apple.music.com/playlist/12345678901234567890").isValid).toBe(false);
  });

  it("rejects malformed IDs containing invalid characters", () => {
    const input = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M;drop_table";
    const result = parseSpotifyPlaylistUrl(input);
    expect(result.isValid).toBe(false);
  });
});
