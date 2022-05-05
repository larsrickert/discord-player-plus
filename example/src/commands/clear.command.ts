import { playerManager } from "../app";
import { Command } from "../types/commands";

export const clearCommand: Command = {
  name: "clear",
  description: "Clears the queue.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const count = player.clear();
    await interaction.reply({ content: `✅ Queue cleared (${count} songs).` });
  },
};
