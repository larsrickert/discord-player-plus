import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

export const createSongCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "song",
    description: playerManager.translations.song.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      const currentTrack = player?.getCurrentTrack();

      if (!player || !currentTrack) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.song.success.replace(
          "{track}",
          trackToMarkdown(currentTrack)
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
