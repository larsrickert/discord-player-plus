import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { playSongController } from "../controllers/play.controllers";
import { Command } from "../types/commands";

export const playCommand: Command = {
  name: "play",
  description:
    "Immediately plays a song/playlist (stopping the current song if playing).",
  options: [
    {
      name: "song",
      description: "URL or name of the song/playlist",
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
    },
  ],
  run: async (interaction) => {
    const song = interaction.options.getString("song", true);
    await playSongController(interaction, song);
  },
};
