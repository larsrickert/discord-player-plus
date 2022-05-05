import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { playerManager } from "../app";
import { config } from "../config";
import { Command } from "../types/commands";

function getVolumeIcon(volume: number): string {
  if (volume <= 0) return "🔇";
  if (volume <= 30) return "🔈";
  if (volume <= 80) return "🔉";
  return "🔊";
}

export const setVolumeCommand: Command = {
  name: "setvolume",
  description:
    "Sets the bot volume for all tracks for all users (server management permissions required).",
  options: [
    {
      name: "volume",
      description: `Volume between 0 and 200, default: ${config.player.initialVolume}`,
      type: ApplicationCommandOptionTypes.NUMBER,
      required: true,
    },
  ],
  run: async (interaction) => {
    if (
      !interaction.memberPermissions.any([
        "ADMINISTRATOR",
        "MANAGE_GUILD",
        "MANAGE_ROLES",
        "MODERATE_MEMBERS",
      ])
    ) {
      return await interaction.reply({
        content: `❌ You are not allowed to change the default volume for the server! Please ask an administrator or user with administrative rights.`,
        ephemeral: true,
      });
    }

    const volume = interaction.options.getNumber("volume", true);

    const player = playerManager.getPlayer(interaction.guildId);
    player.setVolume(volume);

    await interaction.reply({
      content: `${getVolumeIcon(
        volume
      )} Default volume set to ${volume} for all users.`,
    });
  },
};
