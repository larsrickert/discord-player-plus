import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Interaction,
  InteractionReplyOptions,
  InteractionType,
} from "discord.js";
import { PlayerManager } from "../player-manager";
import { Command, CreateCommandOptions, Translations } from "../types/commands";
import { SearchResult } from "../types/engines";
import { PlayOptions } from "../types/player";

/**
 * Helper function to execute slash commands for a given interaction from discord.js. Will check if command is supported, calls its `run` method and handles unexpected errors.
 *
 * @param discord.js interaction received by `client.on("interactionCreate")`.
 * @param commands All available slash commands that should be executable.
 * @param translations Translations used for error messages (e.g. unknown command).
 */
export async function handleSlashCommand(
  interaction: Interaction,
  commands: Command[],
  translations: Pick<Translations, "global">,
): Promise<void> {
  if (
    interaction.type !== InteractionType.ApplicationCommand ||
    interaction.commandType !== ApplicationCommandType.ChatInput
  ) {
    return;
  }

  const slashCommand = commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    return void (await interaction.reply({
      content: translations.global.unsupportedCommand.replace(
        "{command}",
        interaction.commandName,
      ),
      ephemeral: true,
    }));
  }

  if (!interaction.inCachedGuild()) {
    return void (await interaction.reply({
      content: translations.global.unknownGuild,
      ephemeral: true,
    }));
  }

  try {
    await slashCommand.run(interaction);
  } catch (e) {
    if (interaction.replied) return;

    const reply: InteractionReplyOptions = { content: (e as Error).message };

    if (interaction.deferred) await interaction.followUp(reply);
    else await interaction.reply(reply);
  }
}

/**
 * Utility function for playing/adding tracks for an interaction and checking if user is inside the voice channel and bot has proper channel permissions.
 *
 * @param interaction Discord slash command interaction to play/add tracks for.
 * @param immediate if `true` will play track(s), otherwise will add track(s) to end of queue.
 */
export async function playTracks(
  interaction: ChatInputCommandInteraction<"cached">,
  playerManager: PlayerManager,
  immediate: boolean,
  options?: CreateCommandOptions,
): Promise<SearchResult | null> {
  // check that user is in voice channel
  if (!interaction.member.voice.channel) {
    await interaction.reply({
      content: playerManager.translations.play.userNotInVoiceChannel,
      ephemeral: options?.ephemeralError ?? true,
    });
    return null;
  }

  // check bot voice channel permissions
  if (interaction.guild.members.me) {
    const permissions = interaction.member.voice.channel.permissionsFor(
      interaction.guild.members.me,
    );

    if (!permissions.has(["Connect", "Speak"])) {
      await interaction.reply({
        content:
          playerManager.translations.play.insufficientVoiceChannelPermissions.replace(
            "{channel}",
            interaction.member.voice.channel.name,
          ),
        ephemeral: options?.ephemeralError ?? true,
      });
      return null;
    }
  }

  const player = playerManager.get(interaction.guildId);
  const query = interaction.options.getString("query", true);
  await interaction.deferReply({ ephemeral: options?.ephemeral });

  // search tracks
  const searchResult = await player.search(query);

  if (!searchResult?.tracks.length) {
    await interaction.followUp({
      content: playerManager.translations.play.noTracksFound.replace(
        "{query}",
        query,
      ),
    });
    return null;
  }

  // play track(s)
  const playOptions: PlayOptions = {
    tracks: searchResult.playlist
      ? searchResult.tracks
      : searchResult.tracks.slice(0, 1),
    channel: interaction.member.voice.channel,
  };

  if (immediate) await player.play(playOptions);
  else await player.add(playOptions);

  return searchResult;
}
