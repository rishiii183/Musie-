import { z } from "zod";

export const importPlaylistSchema = z.object({
  url: z
    .string({
      required_error: "Spotify playlist URL is required.",
    })
    .min(1, "Please provide a Spotify playlist URL or URI."),
});

export type ImportPlaylistInput = z.infer<typeof importPlaylistSchema>;
