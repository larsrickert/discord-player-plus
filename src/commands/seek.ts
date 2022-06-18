import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { CreateCommandFunc } from "../types/commands";
import { formatDuration } from "../utils/player";

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
        type: ApplicationCommandOptionTypes.NUMBER,
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
