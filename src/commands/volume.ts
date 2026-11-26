import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { CreateCommandFunc } from "../types/commands.js";

/**
 * Creates a `/setvolume` command for setting the player volume between 0 and 200.
 */
export const createSetVolumeCommand: CreateCommandFunc = (playerManager, options) => {
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
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      const volume = interaction.options.getNumber("volume", true);
      const success = player.setVolume(volume);
      if (!success) {
        await interaction.reply({
          content: playerManager.translations.setvolume.failure,
          flags: (options?.ephemeralError ?? true) ? MessageFlags.Ephemeral : undefined,
        });
        return false;
      }

      await interaction.reply({
        content: playerManager.translations.setvolume.success.replace(
          "{volume}",
          volume.toString(),
        ),
        flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined,
      });
      return true;
    },
  };
};
