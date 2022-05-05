import { playerManager } from "../app";
import { Command } from "../types/commands";
import { trackToMarkdown } from "../utils/misc";

export const skipCommand: Command = {
  name: "skip",
  description: "Skips the current song.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const track = player.skip();
    await interaction.reply({
      content: track
        ? `⏭️ Skipped song ${trackToMarkdown(track, { escapeLinks: true })}.`
        : `❌ No song playing.`,
    });
  },
};
