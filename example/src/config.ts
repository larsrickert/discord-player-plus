import { PlayerOptions } from "discord-player-plus";
import "dotenv/config"; // load environment variables from .env file
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "url";

export const config = {
  app: {
    clientToken: process.env.CLIENT_TOKEN ?? "",
  },
  player: {
    initialVolume: 20,
    fileRoot: resolve(dirname(fileURLToPath(import.meta.url)), "../public"),
  } satisfies PlayerOptions,
};
