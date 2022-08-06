import { StreamType } from "@discordjs/voice";
import { Readable } from "stream";
import { PlayerOptions } from "./player";

export interface PlayerEngine {
  /** Source (e.g. "youtube", "spotify" etc.) */
  source: string;
  /**
   * Whether this engine is responsible for searching/streaming the given query.
   * If no available engines are responsible for a user query, YouTube will be used.
   */
  isResponsible(
    query: string,
    playerOptions: PlayerOptions
  ): boolean | Promise<boolean>;
  /** Gets information about the given query. */
  search(
    query: string,
    playerOptions: PlayerOptions,
    options?: SearchOptions
  ): Promise<SearchResult[]>;
  /** Gets the playable stream for the given track. */
  getStream(
    track: Track,
    playerOptions: PlayerOptions
  ): Promise<TrackStream | null>;
}

export interface SearchOptions {
  /**
   * The source where tracks should be searched. If not provided, will automatically detect the source or fall back to YouTube.
   */
  source?: string;
  /**
   * Limit number of tracks to search.
   * Not supported when searching single Spotify track. Due to Spotify limitations, only first 100 playlist tracks are searched.
   */
  limit?: number;
}

export interface SearchResult {
  tracks: Track[];
  playlist?: Playlist;
  source: string;
}

export interface Track {
  title: string;
  /** Track url. If using local file url/path, set `source` to `file`. */
  url: string;
  thumbnailUrl?: string;
  /** Duration in seconds. */
  duration: number;
  artist?: string;
  /**
   * Track source (used player engine). Built-in engines/sources: `youtube`, `spotify`, `file`.
   *
   * @example "youtube"
   */
  source: string;
  playlist?: Playlist;
  /** Number of milliseconds to seek/skip. */
  seek?: number;
}

export interface Playlist {
  title: string;
  url: string;
  thumbnailUrl?: string;
}

export interface TrackStream {
  /**
   * If the input is given as a string, then the inputType option will be overridden and FFmpeg will be used.
   * Can be used as file path when playing local files.
   */
  stream: Readable | string;
  type?: StreamType;
}
