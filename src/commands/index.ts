import {
  CommandInteraction,
  Interaction,
  InteractionReplyOptions,
} from "discord.js";
import { PlayerManager } from "../player-manager";
import { Command, CreateCommandOptions } from "../types/commands";
import { SearchResult } from "../types/engines";
import { PlayOptions } from "../types/player";

export async function handleSlashCommand(
  interaction: Interaction,
  playerManager: PlayerManager,
  commands: Command[]
): Promise<void> {
  if (!interaction.isCommand()) return;

  const slashCommand = commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    return await interaction.reply({
      content: playerManager.translations.global.unsupportedCommand.replace(
        "{command}",
        interaction.commandName
      ),
      ephemeral: true,
    });
  }

  if (!interaction.inCachedGuild()) {
    return await interaction.reply({
      content: playerManager.translations.global.unknownGuild,
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
}

export async function playTracks(
  interaction: CommandInteraction<"cached">,
  playerManager: PlayerManager,
  immediate: boolean,
  options?: CreateCommandOptions
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
  if (interaction.guild.me) {
    const permissions = interaction.member.voice.channel.permissionsFor(
      interaction.guild.me
    );

    if (!permissions.has(["CONNECT", "SPEAK"])) {
      await interaction.reply({
        content:
          playerManager.translations.play.insufficientVoiceChannelPermissions.replace(
            "{channel}",
            interaction.member.voice.channel.name
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
  const firstResult = searchResult[0];

  if (!firstResult || !firstResult.tracks.length) {
    await interaction.followUp({
      content: playerManager.translations.play.noTracksFound.replace(
        "{query}",
        query
      ),
    });
    return null;
  }

  // play track(s)
  const playOptions: PlayOptions = {
    tracks: firstResult.playlist
      ? firstResult.tracks
      : firstResult.tracks.slice(0, 1),
    channel: interaction.member.voice.channel,
  };

  if (immediate) await player.play(playOptions);
  else await player.add(playOptions);

  return firstResult;
}
