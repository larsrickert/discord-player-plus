import { StreamType } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { Readable } from "stream";
import { SearchOptions, SearchResult, Track } from "./engines";

export interface PlayerEvents {
  trackStart: (track: Track) => void;
  trackEnd: () => void;
  destroyed: () => void;
  queueEnd: () => void;
}

export interface TrackStream {
  /**
   * If the input is given as a string, then the inputType option will be overridden and FFmpeg will be used.
   */
  stream: Readable | string;
  type?: StreamType;
}

export interface PlayOptions {
  /** Voice channel to play in. */
  channel: VoiceBasedChannel;
  /** Tracks to play / add to queue. */
  tracks: Track[];
  stream?: StreamOptions;
}

export interface StreamOptions {
  /** Number of milliseconds to seek/skip. */
  seek?: number;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface PlayerOptions {
  /**
   * Audio quality.
   *
   * @default "high"
   */
  quality?: "low" | "medium" | "high";
  /**
   * Setting to `true` will enable the player to change the volume of the play tracks.
   * Set to `false` for better performance.
   *
   * @default `true`
   */
  inlineVolume?: boolean;
  /** Initial player volume for alls tracks between 0 and 200. */
  initialVolume?: number;
  /** Custom function for searching tracks. To use default search, return null. */
  customSearch?: (
    query: string,
    options?: SearchOptions
  ) => Promise<SearchResult[] | null>;
  /** Custom function for stream/play tracks. To use default stream, return null. */
  customStream?: (
    track: Track,
    options?: StreamOptions
  ) => Promise<TrackStream | null>;
}

export interface AudioPlayerMetadata {
  channel: VoiceBasedChannel;
  track: Track;
}
