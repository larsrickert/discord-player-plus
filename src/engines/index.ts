import { stat } from "fs/promises";
import { PlayerEngine, TrackSource } from "../types/engines";
import { fileEngine } from "./file";
import { spotifyEngine } from "./spotify";
import { youtubeEngine } from "./youtube";

export const playerEngines: Record<TrackSource, PlayerEngine> = {
  youtube: youtubeEngine,
  file: fileEngine,
  spotify: spotifyEngine,
};

/**
 * Automatically detect the query type
 */
export async function detectTrackSource(query: string): Promise<TrackSource> {
  if (query.startsWith("https://open.spotify.com/")) return "spotify";
  if (query.startsWith("https://www.youtube.com/")) return "youtube";

  // check if query is file path
  try {
    const stats = await stat(query);
    if (stats.isFile()) return "file";
  } catch (e) {
    // noop
  }

  return "youtube";
}
