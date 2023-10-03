import { CreateCommandFunc } from "../types/commands";

/**
 * Creates a `/shuffle` command for shuffling the queue.
 */
export const createShuffleCommand: CreateCommandFunc = (
  playerManager,
  options,
) => {
  return {
    name: "shuffle",
    description: playerManager.translations.shuffle.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      player.shuffle();

      await interaction.reply({
        content: playerManager.translations.shuffle.success,
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
