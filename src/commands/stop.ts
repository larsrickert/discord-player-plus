import { CreateCommandFunc } from "../types/commands";

/**
 * Creates a `/stop` command for stopping the playback and leaving the voice channel.
 */
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
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      player.stop();

      await interaction.reply({
        content: playerManager.translations.stop.success,
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
