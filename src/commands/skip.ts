import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

export const createSkipCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "skip",
    description: playerManager.translations.skip.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        return await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      const track = player.skip();

      if (!track) {
        return await interaction.reply({
          content: playerManager.translations.skip.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      await interaction.reply({
        content: playerManager.translations.skip.success.replace(
          "{song}",
          trackToMarkdown(track, true)
        ),
        ephemeral: options?.ephemeral,
      });
    },
  };
};
