export interface Track {
  title: string;
  /** Track url. If using local file url/path, set `source` to `file`. */
  url: string;
  thumbnailUrl?: string;
  source: TrackSource | "file";
}

export interface Playlist {
  title: string;
  url: string;
  thumbnailUrl?: string;
}

export type TrackSource = "youtube";
