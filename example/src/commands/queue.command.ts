import { playerManager } from "../app";
import { Command } from "../types/commands";
import { trackToMarkdown } from "../utils/misc";

export const queueCommand: Command = {
  name: "queue",
  description: "Lists all songs in the current queue.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    const currentTrack = player.getCurrentTrack();
    const tracks = player.getQueue();

    if (!currentTrack || !tracks.length) {
      return await interaction.reply({
        content: "🐍 Queue is empty.",
        ephemeral: true,
      });
    }

    let content = `>>> **Queue (${
      tracks.length === 1 ? "1 song" : `${tracks.length} songs`
    })** \n\n**Current song**: ${trackToMarkdown(currentTrack, {
      escapeLinks: true,
    })}`;

    for (let i = 0; i < tracks.length; i++) {
      let newContent = i > 0 ? "\n" : "\n\n";
      newContent += `\`${i + 1}\`: ${trackToMarkdown(tracks[i], {
        escapeLinks: true,
      })}`;
      if (content.length + newContent.length <= 1995) {
        content += newContent;
        continue;
      }
      if (!content.endsWith("\n...")) content += "\n...";
      break;
    }

    await interaction.reply({ content, ephemeral: true });
  },
};
