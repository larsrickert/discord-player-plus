import { CreateCommandFunc } from "../types/commands";

/**
 * Creates a `/resume` command for resuming the currently paused track.
 */
export const createResumeCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "resume",
    description: playerManager.translations.resume.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const paused = player.setPause(false);
      if (!paused) {
        await interaction.reply({
          content: playerManager.translations.resume.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.resume.success,
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
