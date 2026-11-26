import { MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/clear` command for clearing queued tracks.
 */
export const createClearCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "clear",
    description: playerManager.translations.clear.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const count = player.clear();
      await interaction.reply({
        content: playerManager.translations.clear.success.replace("{count}", count.toString()),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
