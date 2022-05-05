import "dotenv/config";
import { Config } from "./types/config";

export const isProduction = process.env.NODE_ENV === "production";

export const config: Config = {
  app: {
    clientToken: process.env.CLIENT_TOKEN ?? "",
  },
  player: {
    initialVolume: 20,
  },
};
