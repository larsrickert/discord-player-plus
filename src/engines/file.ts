import { StreamType } from "@discordjs/voice";
import { PlayerEngine } from "../types/engines";

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
