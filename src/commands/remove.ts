import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";
import { trackToMarkdown } from "../utils/player.js";

/**
 * Creates a `/remove` command for removing tracks from the queue.
 */
export const createRemoveCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "remove",
    description: playerManager.translations.remove.description,
    options: [
      {
        name: "position",
        description: playerManager.translations.remove.optionDescription,
        type: ApplicationCommandOptionType.Integer,
        required: true,
        minValue: 1,
      },
    ],
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const trackPosition = interaction.options.getInteger("position", true);
      const removedTrack = player.remove(trackPosition - 1);

      if (!removedTrack) {
        await interaction.reply({
          content: playerManager.translations.remove.failure,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.remove.success.replace(
          "{track}",
          trackToMarkdown(removedTrack, true),
        ),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
