import { StreamType } from "@discordjs/voice";
import { stat } from "fs/promises";
import path from "path";
import { PlayerEngine } from "../types/engines";
import { isSubPath } from "../utils/fs";

/**
 * Player engine to search/stream tracks that are stored in the file system.
 * Search is currently not supported.
 */
export const fileEngine: PlayerEngine = {
  search: async (query, playerOptions) => {
    if (playerOptions.fileRoot && !isSubPath(playerOptions.fileRoot, query)) {
      return [];
    }

    // check if query is file path
    try {
      const stats = await stat(query);
      if (!stats.isFile()) return [];

      return [
        {
          tracks: [
            {
              title: path.basename(query),
              duration: 0,
              url: query,
              source: "file",
            },
          ],
          source: "file",
        },
      ];
    } catch (e) {
      return [];
    }
  },
  getStream: async (track, playerOptions) => {
    if (
      playerOptions.fileRoot &&
      !isSubPath(playerOptions.fileRoot, track.url)
    ) {
      return null;
    }

    return {
      stream: track.url,
      type: StreamType.Arbitrary,
    };
  },
};
