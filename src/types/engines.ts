import { PlayerOptions, StreamOptions, TrackStream } from "./player";

export interface PlayerEngine {
  source: string;
  isResponsible(query: string, playerOptions: PlayerOptions): Promise<boolean>;
  search(
    query: string,
    playerOptions: PlayerOptions,
    options?: SearchOptions
  ): Promise<SearchResult[]>;
  getStream(
    track: Track,
    playerOptions: PlayerOptions,
    streamOptions?: StreamOptions
  ): Promise<TrackStream | null>;
}

export interface SearchOptions {
  /**
   * The source where tracks should be searched. If not provided, will automatically detect the source or fall back to YouTube.
   */
  source?: string;
  /** Limit number of tracks to search. Does not work for Spotify. */
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
   * Track source (used player engine)
   *
   * @example "youtube"
   */
  source: string;
  playlist?: Playlist;
}

export interface Playlist {
  title: string;
  url: string;
  thumbnailUrl?: string;
}
