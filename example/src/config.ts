import "dotenv/config";
import path from "path";
import { Config } from "./types/config";

export const isProduction = process.env.NODE_ENV === "production";

export const config: Config = {
  app: {
    clientToken: process.env.CLIENT_TOKEN ?? "",
  },
  player: {
    initialVolume: 20,
    fileRoot: path.join(__dirname, "../public"),
  },
};
