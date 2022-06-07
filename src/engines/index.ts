import { PlayerEngine } from "../types/engines";
import { fileEngine } from "./file";
import { spotifyEngine } from "./spotify";
import { youtubeEngine } from "./youtube";

export const playerEngines: Record<string, PlayerEngine> = {
  [youtubeEngine.source]: youtubeEngine,
  [spotifyEngine.source]: spotifyEngine,
  [fileEngine.source]: fileEngine,
};
