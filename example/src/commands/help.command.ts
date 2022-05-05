import { author, version } from "../../package.json";
import { commands } from "../app";
import { Command } from "../types/commands";

export const helpCommand: Command = {
  name: "help",
  description: "Get an overview of all my commands.",
  run: async (interaction) => {
    await interaction.reply({
      embeds: [
        {
          title: "Check out my features",
          description: `❓Your can also see all my commands by starting a new message with "/".`,
          author: {
            name: `A bot by: ${author.name}`,
            url: author.url,
          },
          fields: commands
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => {
              return {
                name: c.name,
                value: c.description,
                inline: true,
              };
            }),
          footer: {
            text: `Bot Version: ${version}`,
          },
        },
      ],
      ephemeral: true,
    });
  },
};
