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
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const paused = player.setPause(true);
      if (!paused) {
        await interaction.reply({
          content: playerManager.translations.pause.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.pause.success,
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
