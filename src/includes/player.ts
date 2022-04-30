import { Client } from "discord.js";

export class DiscordPlayerPlus {
  constructor(private client: Client, private options: PlayerOptions = {}) {}

  /**
   * Immediate plays the given track, skips current track if playing.
   */
  async play(guildId: string, options: PlayOptions): Promise<void> {
    return;
  }

  /**
   * Adds the given track to the end of the queue. Plays immediate if currently not playing and queue is empty.
   */
  async add(guildId: string, options: PlayOptions): Promise<void> {
    return;
  }

  /**
   * Clears queue. Does not stop current track.
   * @returns Number of cleared tracks.
   */
  clear(guildId: string): number {
    return 0;
  }

  /**
   * Skips the current track if playing.
   * @returns Skipped track, if any.
   */
  skip(guildId: string): Track | undefined {
    return;
  }

  /**
   * Pauses or resumes current track.
   */
  setPause(guildId: string, shouldPause: boolean): void {
    return;
  }

  /**
   * Randomly shuffles the current queue.
   */
  shuffle(guildId: string): void {
    return;
  }

  /**
   * Gets the currently playing track, if any.
   */
  getCurrentTrack(guildId: string): Track | undefined {
    return;
  }

  /**
   * Gets a list of queued tracks.
   */
  getQueue(guildId: string): Track[] {
    return [];
  }

  /**
   * Stops the player, clears the current queue and disconnects from the voice channel if connected.
   */
  stop(guildId: string): void {
    return;
  }

  /**
   * Sets the player volume.
   *
   * @param volume Volume between 0 and 200.
   */
  setVolume(guildId: string, volume: number): boolean {
    return false;
  }
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface PlayerOptions {}
export interface PlayOptions {}
export interface Track {}
