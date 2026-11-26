import { MessageFlags } from "discord.js";
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
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const track = player.skip();

      if (!track) {
        await interaction.reply({
          content: playerManager.translations.skip.failure,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.skip.success.replace(
          "{song}",
          trackToMarkdown(track, true),
        ),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
