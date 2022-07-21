import { ApplicationCommandOptionType } from "discord.js";
import { playTracks } from ".";
import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown, urlToMarkdown } from "../utils/player";

/**
 * Creates a `/add` command for adding tracks to the queue.
 */
export const createAddCommand: CreateCommandFunc = (playerManager, options) => {
  return {
    name: "add",
    description: playerManager.translations.add.description,
    options: [
      {
        name: "query",
        description: playerManager.translations.play.optionDescription,
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    run: async (interaction) => {
      const searchResult = await playTracks(
        interaction,
        playerManager,
        false,
        options
      );
      if (!searchResult) return false;

      if (searchResult.playlist) {
        await interaction.followUp({
          content: playerManager.translations.add.successPlaylist.replace(
            "{playlist}",
            urlToMarkdown(
              searchResult.playlist.title,
              searchResult.playlist.url,
              true
            )
          ),
        });
        return true;
      }

      await interaction.followUp({
        content: playerManager.translations.add.successTrack.replace(
          "{track}",
          trackToMarkdown(searchResult.tracks[0], true)
        ),
      });
      return true;
    },
  };
};
