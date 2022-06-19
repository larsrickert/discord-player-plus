import { handleSlashCommand } from "discord-player-plus";
import { Client } from "discord.js";
import { commands, playerManager } from "../app";

export default function registerInteractionCreateListener(
  client: Client
): void {
  client.on("interactionCreate", async (interaction) => {
    await handleSlashCommand(interaction, playerManager, commands);
  });
}
