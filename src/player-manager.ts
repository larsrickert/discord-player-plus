import { deepmerge } from "deepmerge-ts";
import { Player } from "./player";
import { PlayerOptions } from "./types/player";

export class PlayerManager {
  private players: Player[] = [];

  /**
   * Creates a new PlayerManager for easier managing multiple guilds. Your bot should only have one PlayerManager.
   *
   * @param options Options that should be applied for all guilds. Guild specific options can be overridden when calling `getPlayer`.
   */
  constructor(private readonly options?: PlayerOptions) {}

  /**
   * Gets an existing player for the given guildId or creates one if it does not exist.
   *
   * @param optionOverrides Option overrides for the guild player. Will be deep merged with options passed to the PlayerManager.
   */
  getPlayer(guildId: string, optionOverrides?: Partial<PlayerOptions>): Player {
    const player = this.players.find((p) => p.guildId === guildId);
    if (player) return player;

    let options = this.options;
    if (options && optionOverrides) {
      options = deepmerge(options, optionOverrides);
    }
    if (!options && optionOverrides) options = optionOverrides;

    const newPlayer = new Player(guildId, options);
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
   * Removes and destroys the player for the given guildId (if any). Will stop playing audio and leave voice channel if connected.
   */
  remove(guildId: string): void {
    const player = this.find(guildId);
    if (!player) return;
    player.stop();
    this.players = this.players.filter((player) => player.guildId !== guildId);
  }
}
