import { StreamType } from "@discordjs/voice";
import { stat } from "fs/promises";
import path from "path";
import { PlayerEngine } from "../types/engines";
import { isSubPath } from "../utils/fs";

const source = "file";

/**
 * Player engine to search/stream tracks that are stored in the file system.
 */
export const fileEngine: PlayerEngine = {
  source,
  async isResponsible(query, { fileRoot }) {
    if (fileRoot && !isSubPath(fileRoot, query)) {
      return false;
    }

    // check if query is file path
    try {
      const stats = await stat(query);
      return stats.isFile();
    } catch (e) {
      return false;
    }
  },
  async search(query, playerOptions) {
    if (!(await this.isResponsible(query, playerOptions))) {
      return [];
    }

    return [
      {
        tracks: [
          {
            title: path.basename(query),
            duration: 0,
            url: query,
            source,
          },
        ],
        source,
      },
    ];
  },
  async getStream(track, playerOptions) {
    if (!(await this.isResponsible(track.url, playerOptions))) {
      return null;
    }

    return { stream: track.url, type: StreamType.Arbitrary };
  },
};
