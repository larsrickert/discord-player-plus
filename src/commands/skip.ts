import { CreateCommandFunc } from "../types/commands.js";
import { trackToMarkdown } from "../utils/player.js";

/**
 * Creates a `/skip` command for skipping the current track.
 */
export const createSkipCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "skip",
    description: playerManager.translations.skip.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const track = player.skip();

      if (!track) {
        await interaction.reply({
          content: playerManager.translations.skip.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.skip.success.replace(
          "{song}",
          trackToMarkdown(track, true),
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
