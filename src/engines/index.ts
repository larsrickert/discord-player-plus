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
export function detectTrackSource(query: string): TrackSource {
  if (!query.startsWith("https://")) return "file";
  if (query.startsWith("https://open.spotify.com/")) return "spotify";
  return "youtube";
}
