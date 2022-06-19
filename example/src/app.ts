import {
  Command,
  createAddCommand,
  createClearCommand,
  createHelpCommand,
  createPauseCommand,
  createPlayCommand,
  createQueueCommand,
  createRepeatCommand,
  createResumeCommand,
  createSeekCommand,
  createSetVolumeCommand,
  createShuffleCommand,
  createSkipCommand,
  createSongCommand,
  createStopCommand,
  handleSlashCommand,
  PlayerManager,
} from "discord-player-plus";
import { Client, Intents } from "discord.js";
import { config } from "./config";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

export const playerManager = new PlayerManager({
  playerDefault: config.player,
});

export const slashCommands: Command[] = [
  createAddCommand(playerManager),
  createClearCommand(playerManager),
  createPauseCommand(playerManager),
  createPlayCommand(playerManager),
  createQueueCommand(playerManager, { ephemeral: true }),
  createResumeCommand(playerManager),
  createShuffleCommand(playerManager),
  createSkipCommand(playerManager),
  createSongCommand(playerManager, { ephemeral: true }),
  createStopCommand(playerManager),
  createSetVolumeCommand(playerManager),
  createRepeatCommand(playerManager),
  createSeekCommand(playerManager),
];
slashCommands.push(
  createHelpCommand(playerManager, {
    commands: slashCommands,
    title: "Example bot for discord-player-plus",
    url: "https://github.com/larsrickert/discord-player-plus",
    author: {
      name: "Lars Rickert",
      url: "https://lars-rickert.de",
      iconUrl: "https://avatars.githubusercontent.com/u/67898185?v=4",
    },
    footerText: "Thanks for using discord-player-plus",
  })
);

client
  .on("ready", async (client) => {
    console.log(`Bot ready and logged in as ${client.user.tag}`);
    await client.application.commands.set(slashCommands);
    client.user.setActivity({ name: "/help", type: "LISTENING" });
  })
  .on("interactionCreate", async (interaction) => {
    await handleSlashCommand(
      interaction,
      slashCommands,
      playerManager.translations
    );
  });

client.login(config.app.clientToken);
