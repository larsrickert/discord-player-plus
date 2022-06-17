import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

export const createQueueCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "queue",
    description: playerManager.translations.queue.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const currentTrack = player.getCurrentTrack();
      const tracks = player.getQueue();

      if (!currentTrack || !tracks.length) {
        await interaction.reply({
          content: playerManager.translations.queue.empty,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      let content = `>>> **Queue (${tracks.length})**`;
      content += `\n\n**${
        playerManager.translations.queue.currentTrack
      }**: ${trackToMarkdown(currentTrack, true)}`;

      for (let i = 0; i < tracks.length; i++) {
        let newContent = i > 0 ? "\n" : "\n\n";
        newContent += `\`${i + 1}\`: ${trackToMarkdown(tracks[i], true)}`;

        // discord only allows max 2000 chars
        if (content.length + newContent.length <= 1995) {
          content += newContent;
          continue;
        }

        if (!content.endsWith("\n...")) content += "\n...";
        break;
      }

      await interaction.reply({ content, ephemeral: options?.ephemeral });
      return true;
    },
  };
};
