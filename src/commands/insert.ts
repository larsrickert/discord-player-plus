import { ApplicationCommandOptionType } from "discord.js";
import { CreateCommandFunc } from "../types/commands";
import { trackToMarkdown } from "../utils/player";

/**
 * Creates a `/insert` command for adding a track to a specific position in the queue.
 * If the user query searches a playlist instead of a single track, only the first track will be inserted.
 */
export const createInsertCommand: CreateCommandFunc = (
  playerManager,
  options
) => {
  return {
    name: "insert",
    description: playerManager.translations.jump.description,
    options: [
      {
        name: "query",
        description: playerManager.translations.play.optionDescription,
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "position",
        description: playerManager.translations.insert.optionDescription,
        type: ApplicationCommandOptionType.Integer,
        required: true,
        minValue: 1,
      },
    ],
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      const voiceChannel = player?.getVoiceChannel();

      if (!player || !voiceChannel) {
        await interaction.reply({
          content: playerManager.translations.global.noGuildPlayer,
          ephemeral: options?.ephemeralError ?? true,
        });
        return false;
      }

      await interaction.deferReply({ ephemeral: options?.ephemeral });

      const query = interaction.options.getString("query", true);
      const trackIndex = interaction.options.getInteger("position", true) - 1;

      // search tracks
      const searchResult = await player.search(query);

      if (!searchResult?.tracks.length) {
        await interaction.followUp({
          content: playerManager.translations.play.noTracksFound.replace(
            "{query}",
            query
          ),
        });
        return false;
      }

      const queue = player.getQueue();

      const track = searchResult.tracks[0];
      player.insert(track, trackIndex);

      // human friendly track position
      const insertedPosition =
        trackIndex >= queue.length ? queue.length + 1 : trackIndex + 1;

      await interaction.followUp({
        content: playerManager.translations.insert.success
          .replace("{track}", trackToMarkdown(track, true))
          .replace("{position}", insertedPosition.toString()),
      });
      return false;
    },
  };
};
