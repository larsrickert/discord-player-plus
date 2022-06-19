import { PlayerOptions } from "discord-player-plus";
import "dotenv/config";
import path from "path";

export const config: Config = {
  app: {
    clientToken: process.env.CLIENT_TOKEN ?? "",
  },
  player: {
    initialVolume: 20,
    fileRoot: path.join(__dirname, "../public"),
  },
};

interface Config {
  app: {
    clientToken: string;
  };
  player: PlayerOptions;
}
