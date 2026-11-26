import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/pause` command for pausing the current track.
 */
export const createPauseCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "pause",
    description: playerManager.translations.pause.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const paused = player.setPause(true);
      if (!paused) {
        await interaction.reply({
          content: playerManager.translations.pause.failure,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.pause.success,
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
