import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/shuffle` command for shuffling the queue.
 */
export const createShuffleCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "shuffle",
    description: playerManager.translations.shuffle.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      player.shuffle();

      await interaction.reply({
        content: playerManager.translations.shuffle.success,
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
