import { ApplicationCommandOptionType } from "discord.js";
import { CreateCommandFunc } from "../types/commands";

/**
 * Creates a `/setvolume` command for setting the player volume between 0 and 200.
 */
export const createSetVolumeCommand: CreateCommandFunc = (
  playerManager,
  options,
) => {
  return {
    name: "setvolume",
    description: playerManager.translations.setvolume.description,
    options: [
      {
        name: "volume",
        description: playerManager.translations.setvolume.optionDescription,
        type: ApplicationCommandOptionType.Number,
        required: true,
        minValue: 0,
        maxValue: 200,
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

      const volume = interaction.options.getNumber("volume", true);
      const success = player.setVolume(volume);
      if (!success) {
        await interaction.reply({
          content: playerManager.translations.setvolume.failure,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.setvolume.success.replace(
          "{volume}",
          volume.toString(),
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
