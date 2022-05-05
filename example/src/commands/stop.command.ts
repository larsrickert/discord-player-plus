import { playerManager } from "../app";
import { Command } from "../types/commands";

export const stopCommand: Command = {
  name: "stop",
  description: "Stops the player, clears the queue and disconnects the bot.",
  run: async (interaction) => {
    const player = playerManager.getPlayer(interaction.guildId);
    player.stop();
    await interaction.reply({ content: "✌️ Ciao!" });
  },
};
