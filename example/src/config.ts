import { PlayerOptions } from "discord-player-plus";
import path from "node:path";

export const config = {
  app: {
    clientToken: process.env.CLIENT_TOKEN ?? "",
  },
  player: {
    initialVolume: 20,
    fileRoot: path.join(import.meta.dirname, "../public"),
  } satisfies PlayerOptions,
};
