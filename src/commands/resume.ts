import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/resume` command for resuming the currently paused track.
 */
export const createResumeCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "resume",
    description: playerManager.translations.resume.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const paused = player.setPause(false);
      if (!paused) {
        await interaction.reply({
          content: playerManager.translations.resume.failure,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.resume.success,
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
