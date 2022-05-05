import {
  Client,
  CommandInteraction,
  Interaction,
  InteractionReplyOptions,
} from "discord.js";
import { commands } from "../app";

export default function registerInteractionCreateListener(
  client: Client
): void {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleSlashCommand(interaction);
    }
  });
}

const handleSlashCommand = async (
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    return await interaction.reply({
      content: `❌ I don't support the command "/${interaction.commandName}"!`,
    });
  }

  if (!interaction.inCachedGuild()) {
    return await interaction.reply({
      content: "❌ I can't figure out which server you are on!",
      ephemeral: true,
    });
  }

  try {
    await slashCommand.run(interaction);
  } catch (e) {
    if (interaction.replied) return;

    const reply: InteractionReplyOptions = { content: (e as Error).message };

    if (interaction.deferred) await interaction.followUp(reply);
    else await interaction.reply(reply);
  }
};
