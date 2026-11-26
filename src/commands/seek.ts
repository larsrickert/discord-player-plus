import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";
import { formatDuration } from "../utils/player.js";

/**
 * Creates a `/seek` command for seeking the current track to a specific duration.
 */
export const createSeekCommand: CreateCommandFunc = (playerManager, options) => {
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
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.deferReply({
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });

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
          formatDuration(time),
        ),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
