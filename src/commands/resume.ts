import { CreateCommandFunc } from "../types/commands";

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
        return await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      const paused = player.setPause(false);
      if (!paused) {
        return await interaction.reply({
          content: playerManager.translations.resume.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      await interaction.reply({
        content: playerManager.translations.resume.success,
        ephemeral: options?.ephemeral,
      });
    },
  };
};
