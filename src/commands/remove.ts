import { ApplicationCommandOptionType } from "discord.js";
import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

/**
 * Creates a `/remove` command for removing tracks from the queue.
 */
export const createRemoveCommand: CreateCommandFunc = (
  playerManager,
  options,
) => {
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
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const trackPosition = interaction.options.getInteger("position", true);
      const removedTrack = player.remove(trackPosition - 1);

      if (!removedTrack) {
        await interaction.reply({
          content: playerManager.translations.remove.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.remove.success.replace(
          "{track}",
          trackToMarkdown(removedTrack, true),
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
