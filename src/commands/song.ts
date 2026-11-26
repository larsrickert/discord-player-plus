import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";
import { trackToMarkdown } from "../utils/player.js";

/**
 * Creates a `/song` command for getting information about the currently played track.
 */
export const createSongCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "song",
    description: playerManager.translations.song.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      const currentTrack = player?.getCurrentTrack();

      if (!player || !currentTrack) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.song.success.replace(
          "{track}",
          trackToMarkdown(currentTrack),
        ),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
