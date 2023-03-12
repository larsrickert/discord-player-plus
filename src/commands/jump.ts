import { ApplicationCommandOptionType } from "discord.js";
import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

/**
 * Creates a `/jump` command for jumping to a specific track inside the queue (will skip all songs before the given track).
 */
export const createJumpCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "jump",
    description: playerManager.translations.jump.description,
    options: [
      {
        name: "position",
        description: playerManager.translations.jump.optionDescription,
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

      await interaction.deferReply({ ephemeral: options?.ephemeral });

      const trackPosition = interaction.options.getInteger("position", true);

      const success = await player.jump(trackPosition - 1);
      if (!success) {
        await interaction.followUp({
          content: playerManager.translations.jump.failure,
        });
        return false;
      }

      const currentTrack = player.getCurrentTrack();

      await interaction.followUp({
        content: playerManager.translations.jump.success.replace(
          "{track}",
          currentTrack ? trackToMarkdown(currentTrack, true) : ""
        ),
      });
      return true;
    },
  };
};
