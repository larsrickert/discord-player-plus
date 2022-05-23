import { PlayerOptions, StreamOptions, TrackStream } from "./player";

export interface PlayerEngine {
  search(query: string, isPlaylist?: boolean): Promise<SearchResult[]>;
  getStream(
    track: Track,
    playerOptions: PlayerOptions,
    streamOptions?: StreamOptions
  ): Promise<TrackStream | null>;
}

export interface SearchOptions {
  /**
   * The search mode to be used for searching tracks.
   *
   * @default `SearchType.AUTO`
   */
  type?: SearchType;
}

export interface SearchResult {
  tracks: Track[];
  playlist?: Playlist;
  source: TrackSource;
}

export interface Track {
  title: string;
  /** Track url. If using local file url/path, set `source` to `file`. */
  url: string;
  thumbnailUrl?: string;
  /** Duration in seconds. */
  duration: number;
  artist?: string;
  source: TrackSource;
  playlist?: Playlist;
}

export interface Playlist {
  title: string;
  url: string;
  thumbnailUrl?: string;
}

export type TrackSource = "file" | "youtube" | "spotify";

export enum SearchType {
  AUTO,
  YOUTUBE_TRACKS,
  YOUTUBE_PLAYLIST,
  SPOTIFY_TRACKS,
  SPOTIFY_PLAYLIST,
}

export interface SearchTypeInfo {
  type: Exclude<SearchType, SearchType.AUTO>;
  isPlaylist: boolean;
  source: TrackSource;
}
