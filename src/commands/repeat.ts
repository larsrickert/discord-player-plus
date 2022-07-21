import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
} from "discord.js";
import { CreateCommandFunc } from "../types/commands";
import { PlayerRepeatMode } from "../types/player";

/**
 * Creates a `/repeat` command for setting the repeat mode.
 */
export const createRepeatCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "repeat",
    description: playerManager.translations.repeat.description,
    options: [
      {
        name: "mode",
        type: ApplicationCommandOptionType.Integer,
        description: playerManager.translations.repeat.modeDescription,
        required: true,
        choices: Object.entries(PlayerRepeatMode)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => typeof value === "number")
          .map<ApplicationCommandOptionChoiceData>(([key, value]) => {
            return {
              value,
              name:
                (
                  playerManager.translations.repeat.modes as Record<
                    string,
                    string
                  >
                )[key.toString().toLowerCase()] ?? "",
            };
          }),
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

      const mode = interaction.options.getInteger(
        "mode",
        true
      ) as PlayerRepeatMode;
      player.setRepeat(mode);

      await interaction.reply({
        content: playerManager.translations.repeat.success.replace(
          "{mode}",
          (playerManager.translations.repeat.modes as Record<string, string>)[
            PlayerRepeatMode[mode].toString().toLowerCase()
          ] ?? ""
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
