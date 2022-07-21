import { ApplicationCommandOptionType } from "discord.js";
import { CreateCommandFunc } from "../types/commands";
import { formatDuration } from "../utils/player";

/**
 * Creates a `/seek` command for seeking the current track to a specific duration.
 */
export const createSeekCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "seek",
    description: playerManager.translations.seek.description,
    options: [
      {
        name: "time",
        description: playerManager.translations.seek.optionDescription,
        type: ApplicationCommandOptionType.Number,
        required: true,
        minValue: 0,
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

      await interaction.deferReply({ ephemeral: options?.ephemeral });

      const time = interaction.options.getNumber("time", true);

      const success = await player.seek(time * 1000);
      if (!success) {
        await interaction.followUp({
          content: playerManager.translations.seek.failure,
        });
        return false;
      }

      await interaction.followUp({
        content: playerManager.translations.seek.success.replace(
          "{duration}",
          formatDuration(time)
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
