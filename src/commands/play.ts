import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { playTracks } from ".";
import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown, urlToMarkdown } from "../utils/player";

export const createPlayCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "play",
    description: playerManager.translations.play.description,
    options: [
      {
        name: "query",
        description: playerManager.translations.play.optionDescription,
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
      },
    ],
    run: async (interaction) => {
      const searchResult = await playTracks(
        interaction,
        playerManager,
        true,
        options
      );
      if (!searchResult) return false;

      if (searchResult.playlist) {
        await interaction.followUp({
          content: playerManager.translations.play.successPlaylist.replace(
            "{playlist}",
            urlToMarkdown(
              searchResult.playlist.title,
              searchResult.playlist.url
            )
          ),
        });
        return true;
      }

      await interaction.followUp({
        content: playerManager.translations.play.successTrack.replace(
          "{track}",
          trackToMarkdown(searchResult.tracks[0])
        ),
      });
      return true;
    },
  };
};
