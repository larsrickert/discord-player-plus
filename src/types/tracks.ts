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

export type TrackSource = "youtube" | "file";

export enum SearchType {
  AUTO,
  YOUTUBE_TRACKS,
  YOUTUBE_PLAYLIST,
}
