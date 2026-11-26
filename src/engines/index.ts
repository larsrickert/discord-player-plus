import { PlayerEngine } from "../types/engines.js";
import { fileEngine } from "./file.js";
import { spotifyEngine } from "./spotify.js";
import { youtubeEngine } from "./youtube.js";

export const playerEngines: Record<string, PlayerEngine> = {
  [youtubeEngine.source]: youtubeEngine,
  [spotifyEngine.source]: spotifyEngine,
  [fileEngine.source]: fileEngine,
};
