import { PlayerOptions } from "discord-player-plus";

export interface Config {
  app: {
    clientToken: string;
  };
  player: PlayerOptions;
}
