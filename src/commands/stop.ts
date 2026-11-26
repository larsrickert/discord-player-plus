import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/stop` command for stopping the playback and leaving the voice channel.
 */
export const createStopCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "stop",
    description: playerManager.translations.stop.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      player.stop();

      await interaction.reply({
        content: playerManager.translations.stop.success,
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
