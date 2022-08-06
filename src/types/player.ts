import { VoiceBasedChannel } from "discord.js";
import { Translations } from "./commands";
import { PlayerEngine, Track } from "./engines";

// #region PlayerEvents
export interface PlayerEvents {
  /** Emitted after a new track has started. */
  trackStart: (track: Track) => void;
  /**
   * Emitted after a track has ended and before a new track has started.
   * Will not be emitted when player is stopped while playing (`destroyed` event).
   */
  trackEnd: () => void;
  /**
   * Emitted after the player was destroyed/player left voice channel.
   * Since the player is being destroyed when the queue is empty, this event can also be seen as `queueEnd` event.
   */
  destroyed: () => void;
  /** Emitted before a player error is thrown. */
  error: (error: PlayerError) => void;
}
// #endregion PlayerEvents

export type PlayerManagerEvents = {
  [K in keyof PlayerEvents]: PlayerEvents[K] extends (...a: infer U) => infer R
    ? (guildId: string, ...a: U) => R
    : never;
};

export interface PlayOptions {
  /** Voice channel to play in. */
  channel: VoiceBasedChannel;
  /** Tracks to play / add to queue. */
  tracks: Track[];
  /**
   * If `true` and player is currently playing a track, it will be added to the front of the queue with the current playback duration.
   * Can be used to temporarily play a (short) track.
   */
  addSkippedTrackToQueue?: boolean;
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
   * Setting to `true` will enable the player to change the volume of the played tracks.
   * Set to `false` for slightly better performance.
   *
   * @default true
   */
  inlineVolume?: boolean;
  /**
   * Initial player volume for all tracks between 0 and 200. Can also be an (async) function that returns the volume.
   */
  initialVolume?: number | ((guildId: string) => number | Promise<number>);
  /**
   * Path to the folder where local files should be playable from. Must be set if local files should be playable.
   * For security reasons files outside this directory are refused to play.
   *
   * @example
   * ```ts
   * // files outside of this public folder wont be playable
   * fileRoot: path.join(__dirname, "../public")
   * ```
   */
  fileRoot?: string;
  /** Custom player engines to provide additional streaming services or override existing ones. */
  customEngines?: Record<string, PlayerEngine>;
  /**
   * When `true` and the player is already playing in voice channel A, player will be allowed to switch to
   * voice channel B. If `false`, player wont connect to another voice channel when he is already playing in a voice channel.
   *
   * @default true
   *
   */
  allowSwitchChannels?: boolean;
}

export interface PlayerManagerOptions {
  /** Player options that should be applied for all guilds. Guild specific options can be overridden when calling `playerManager.get(guildId)`. */
  playerDefault?: PlayerOptions;
  /** Translations for the pre-build commands. Default: en */
  translations?: Translations;
}

export enum PlayerRepeatMode {
  /** No tracks are repeated (default) */
  NONE,
  /** Repeat currently playing track */
  TRACK,
}

export enum PlayerErrorCode {
  REFUSED_TO_SWITCH_VOICE_CHANNEL,
  UNKNOWN_PLAYER_ENGINE,
  UNABLE_TO_CREATE_TRACK_STREAM,
  INITIAL_VOLUME_FUNCTION_ERROR,
}

export class PlayerError extends Error {
  constructor(public readonly code: PlayerErrorCode, msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PlayerError.prototype);
  }
}
