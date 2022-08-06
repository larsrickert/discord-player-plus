import { deepmerge } from "deepmerge-ts";
import { TypedEmitter } from "tiny-typed-emitter";

import en from "./languages/en.json";
import { Player } from "./player";
import { Translations } from "./types/commands";
import {
  PlayerManagerEvents,
  PlayerManagerOptions,
  PlayerOptions,
} from "./types/player";

export class PlayerManager extends TypedEmitter<PlayerManagerEvents> {
  private players: Player[] = [];

  /**
   * Creates a new PlayerManager for easier managing multiple guilds. Your bot should only have one PlayerManager.
   */
  constructor(public readonly options?: PlayerManagerOptions) {
    super();
  }

  get translations(): Translations {
    return this.options?.translations ?? en;
  }

  /**
   * Gets an existing player for the given guildId or creates one if it does not exist.
   *
   * @param optionOverrides Option overrides for the guild player. Will be deep merged with options passed to the PlayerManager.
   */
  get(guildId: string, optionOverrides?: Partial<PlayerOptions>): Player {
    const player = this.players.find((p) => p.guildId === guildId);
    if (player) return player;

    let options = this.options?.playerDefault;
    if (options && optionOverrides) {
      options = deepmerge(options, optionOverrides);
    }
    if (!options && optionOverrides) options = optionOverrides;

    const newPlayer = new Player(guildId, options);
    newPlayer
      .on("trackStart", (track) => this.emit("trackStart", guildId, track))
      .on("trackEnd", (track) => this.emit("trackEnd", guildId, track))
      .on("error", (error) => this.emit("error", guildId, error))
      .on("destroyed", () => this.emit("destroyed", guildId));

    this.players.push(newPlayer);
    return newPlayer;
  }

  /**
   * Gets the player for the given guildId if it exists. Does not create a player.
   */
  find(guildId: string): Player | undefined {
    return this.players.find((player) => player.guildId === guildId);
  }

  /**
   * Removes and stops the player for the given guildId (if any).
   */
  remove(guildId: string): void {
    const player = this.find(guildId);
    if (!player) return;
    player.stop();
    this.players = this.players.filter((player) => player.guildId !== guildId);
  }
}
