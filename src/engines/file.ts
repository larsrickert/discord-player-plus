import { StreamType } from "@discordjs/voice";
import { PlayerEngine } from "../types/engines";

/**
 * Player engine to search/stream tracks that are stored in the file system.
 * Search is currently not supported.
 */
export const fileEngine: PlayerEngine = {
  search: async () => {
    return [];
  },
  getStream: async (track) => {
    return Promise.resolve({
      stream: track.url,
      type: StreamType.Arbitrary,
    });
  },
};
