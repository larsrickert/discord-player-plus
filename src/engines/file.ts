import { StreamType } from "@discordjs/voice";
import { stat } from "fs/promises";
import { IAudioMetadata, parseFile } from "music-metadata";
import path from "path";
import { PlayerEngine, Track } from "../types/engines";
import { isSubPath } from "../utils/fs";

async function isFile(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

/**
 * Player engine to search/stream tracks that are stored in the file system.
 */
export const fileEngine = {
  source: "file",
  isResponsible(query, { fileRoot }) {
    return !!fileRoot && isSubPath(fileRoot, query);
  },
  async search(query, playerOptions) {
    // refuse to search files outside of fileRoot
    if (!this.isResponsible(query, playerOptions)) return [];
    if (!(await isFile(query))) return [];

    // get file metadata
    let metadata: IAudioMetadata;
    try {
      metadata = await parseFile(query, { skipCovers: true });
    } catch (e) {
      return [];
    }

    const track: Track = {
      title: metadata.common.title || path.basename(query),
      duration: metadata.format.duration || 0,
      url: query,
      artist: metadata.common.artists?.join(", "),
      source: this.source,
    };

    return [{ tracks: [track], source: this.source }];
  },
  async getStream(track, playerOptions) {
    // refuse to stream files outside of fileRoot
    if (!this.isResponsible(track.url, playerOptions)) return null;
    if (!(await isFile(track.url))) return null;

    return { stream: track.url, type: StreamType.Arbitrary };
  },
} as const satisfies PlayerEngine;
