import { PlayerEngine, TrackSource } from "../types/engines";
import { fileEngine } from "./file";
import { spotifyEngine } from "./spotify";
import { youtubeEngine } from "./youtube";

export const playerEngines: Record<TrackSource, PlayerEngine> = {
  youtube: youtubeEngine,
  spotify: spotifyEngine,
  file: fileEngine,
};
