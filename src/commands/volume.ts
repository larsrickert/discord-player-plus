import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { CreateCommandFunc } from "../types/commands";

export const createSetVolumeCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "setvolume",
    description: playerManager.translations.setvolume.description,
    options: [
      {
        name: "volume",
        description: playerManager.translations.setvolume.optionDescription,
        type: ApplicationCommandOptionTypes.NUMBER,
        required: true,
        minValue: 0,
        maxValue: 200,
      },
    ],
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        return await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      const volume = interaction.options.getNumber("volume", true);
      const success = player.setVolume(volume);
      if (!success) {
        await interaction.reply({
          content: playerManager.translations.setvolume.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
      }

      await interaction.reply({
        content: playerManager.translations.setvolume.success.replace(
          "{volume}",
          volume.toString()
        ),
        ephemeral: options?.ephemeral,
      });
    },
  };
};
