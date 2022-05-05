import { playerManager } from "../app";
import { Command } from "../types/commands";

export const pauseCommand: Command = {
  name: "pause",
  description: "Pauses the current song.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const paused = player.setPause(true);
    await interaction.reply({
      content: paused ? "⏸️ Song paused." : "❌ Unable to pause song.",
    });
  },
};
