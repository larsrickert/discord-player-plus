import { CreateCommandFunc } from "../types/commands";

export const createStopCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "stop",
    description: playerManager.translations.stop.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        return await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      player.stop();

      await interaction.reply({
        content: playerManager.translations.stop.success,
        ephemeral: options?.ephemeral,
      });
    },
  };
};
