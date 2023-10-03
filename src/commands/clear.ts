import { CreateCommandFunc } from "../types/commands";

/**
 * Creates a `/clear` command for clearing queued tracks.
 */
export const createClearCommand: CreateCommandFunc = (
  playerManager,
  options,
) => {
  return {
    name: "clear",
    description: playerManager.translations.clear.description,
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      const count = player.clear();
      await interaction.reply({
        content: playerManager.translations.clear.success.replace(
          "{count}",
          count.toString(),
        ),
        ephemeral: options?.ephemeral,
      });
      return true;
    },
  };
};
