import { CommandInteraction } from "discord.js";
import { PlayOptions } from "../../../src";
import { playerManager } from "../app";

export async function playSongController(
  interaction: CommandInteraction<"cached">,
  song: string,
  immediate = true
) {
  if (!interaction.member.voice.channel) {
    return await interaction.reply({
      content: "❌ You must be in a voice channel to play music!",
      ephemeral: true,
    });
  }

  if (!interaction.channel) {
    return await interaction.reply({
      content: "❌ You must run this command in a text channel!",
      ephemeral: true,
    });
  }

  if (
    interaction.guild.me?.voice.channelId &&
    interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
  ) {
    return await interaction.reply({
      content: "❌ You are not in my voice channel!",
      ephemeral: true,
    });
  }

  if (interaction.guild.me) {
    const permissions = interaction.member.voice.channel.permissionsFor(
      interaction.guild.me
    );

    if (!permissions.has(["CONNECT", "SPEAK"])) {
      return await interaction.reply({
        content: `❌ I don't have sufficient permissions in your channel "${interaction.member.voice.channel.name}" to play music!`,
        ephemeral: true,
      });
    }
  }

  await interaction.deferReply({ ephemeral: true });

  const player = playerManager.getPlayer(interaction.guildId);

  const { tracks } = await player.search(song);

  if (!tracks.length) {
    return await interaction.followUp({
      content: `❌ No songs found for your search "${song}"!`,
    });
  }

  await interaction.followUp({ content: `⏱️ Loading song...` });

  const playOptions: PlayOptions = {
    channel: interaction.member.voice.channel,
    tracks: tracks.slice(0, 1),
  };

  if (immediate) await player.play(playOptions);
  else await player.add(playOptions);

  if (
    interaction.guild.me &&
    !interaction.channel
      .permissionsFor(interaction.guild.me)
      .has(["VIEW_CHANNEL", "SEND_MESSAGES"])
  ) {
    await interaction.followUp({
      content: `ℹ️ You ran the command in a text channel that I can't see or don't have permission to post messages. Therefore not all of my functions are available.`,
      ephemeral: true,
    });
  }
}
