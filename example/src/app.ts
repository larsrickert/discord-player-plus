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
  PlayerManager,
} from "discord-player-plus";
import { Client, Intents } from "discord.js";
import { config } from "./config";
import registerInteractionCreateListener from "./listeners/interactionCreate.listener";
import registerReadyListener from "./listeners/ready.listener";

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

export const commands: Command[] = [
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
commands.push(
  createHelpCommand(playerManager, {
    commands,
    author: {
      name: "Lars Rickert",
      url: "https://lars-rickert.de",
      iconUrl: "https://avatars.githubusercontent.com/u/67898185?v=4",
    },
    title: "Example bot for discord-player-plus",
    url: "https://github.com/larsrickert/discord-player-plus",
  })
);

registerReadyListener(client, commands);
registerInteractionCreateListener(client);

client.login(config.app.clientToken);
