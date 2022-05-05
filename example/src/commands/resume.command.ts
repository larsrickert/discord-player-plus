import { playerManager } from "../app";
import { Command } from "../types/commands";

export const resumeCommand: Command = {
  name: "resume",
  description: "Resumes playback of the currently paused song.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const paused = player.setPause(false);
    await interaction.reply({
      content: paused ? "▶️ Let's go." : "❌ Unable to resume song.",
    });
  },
};
