import { playerManager } from "../app";
import { Command } from "../types/commands";

export const shuffleCommand: Command = {
  name: "shuffle",
  description: "Shuffles the current queue.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    player.shuffle();
    await interaction.reply({ content: "🔀 Queue shuffled." });
  },
};
