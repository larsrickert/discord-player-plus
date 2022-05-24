import { CreateCommandFunc } from "../types/commands";

export const createPauseCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "pause",
    description: playerManager.translations.pause.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        return await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      const paused = player.setPause(true);
      if (!paused) {
        return await interaction.reply({
          content: playerManager.translations.pause.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      await interaction.reply({
        content: playerManager.translations.pause.success,
        ephemeral: options?.ephemeral,
      });
    },
  };
};
