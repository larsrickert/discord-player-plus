import { Client, Interaction } from "discord.js";
import { handleSlashCommand } from "../../../src/commands";
import { commands, playerManager } from "../app";

export default function registerInteractionCreateListener(
  client: Client
): void {
  client.on("interactionCreate", async (interaction: Interaction) => {
    await handleSlashCommand(interaction, playerManager, commands);
  });
}
