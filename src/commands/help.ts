import { PlayerManager } from "../player-manager";
import { Command, CreateHelpCommandOptions } from "../types/commands";

export const createHelpCommand = (
  playerManager: PlayerManager,
  options: CreateHelpCommandOptions
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
            footer: {
              text: options.footerText,
            },
          },
        ],
        ephemeral: true,
      });
      return true;
    },
  };
};
