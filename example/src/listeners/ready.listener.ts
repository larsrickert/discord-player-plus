import { Client } from "discord.js";
import { Command } from "../types/commands";

export default function registerReadyListener(
  client: Client,
  commands: Command[]
): void {
  client.on("ready", async (client) => {
    console.log(`Bot ready and logged in as ${client.user.tag}`);
    await client.application.commands.set(commands);
    client.user.setActivity({ name: "/help", type: "LISTENING" });
  });
}
