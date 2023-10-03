import { PlayerManager } from "../player-manager";
import { Command, CreateHelpCommandOptions } from "../types/commands";

/**
 * Creates a `/help` command for showing all available commands and bot metadata.
 */
export const createHelpCommand = (
  playerManager: PlayerManager,
  options: CreateHelpCommandOptions,
): Command => {
  return {
    name: "help",
    description: playerManager.translations.help.description,
    run: async (interaction) => {
      await interaction.reply({
        embeds: [
          {
            title: options.title,
            url: options.url,
            description: options.description,
            author: options.author
              ? {
                  name: options.author.name,
                  icon_url: options.author.iconUrl,
                  url: options.author.url,
                }
              : undefined,
            fields: options.commands
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => {
                return {
                  name: c.name,
                  value: c.description,
                  inline: true,
                };
              }),
            footer: options.footerText
              ? {
                  text: options.footerText,
                }
              : undefined,
          },
        ],
        ephemeral: true,
      });
      return true;
    },
  };
};
