import { playerManager } from "../app";
import { Command } from "../types/commands";
import { trackToMarkdown } from "../utils/misc";

export const songCommand: Command = {
  name: "song",
  description: "Outputs information about the current song.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const track = player.getCurrentTrack();

    await interaction.reply({
      content: track
        ? `🎶 Current song: ${trackToMarkdown(track, {
            includePlaylist: true,
          })}`
        : `❌ Nothing is currently played.`,
      ephemeral: true,
    });
  },
};
