import { Client, Intents } from "discord.js";
import { PlayerManager } from "../../src";
import { addCommand } from "./commands/add.command";
import { clearCommand } from "./commands/clear.command";
import { helpCommand } from "./commands/help.command";
import { pauseCommand } from "./commands/pause.command";
import { playCommand } from "./commands/play.command";
import { queueCommand } from "./commands/queue.command";
import { resumeCommand } from "./commands/resume.command";
import { shuffleCommand } from "./commands/shuffle.command";
import { skipCommand } from "./commands/skip.command";
import { songCommand } from "./commands/song.command";
import { stopCommand } from "./commands/stop.command";
import { setVolumeCommand } from "./commands/volume.command";
import { config } from "./config";
import registerInteractionCreateListener from "./listeners/interactionCreate.listener";
import registerReadyListener from "./listeners/ready.listener";
import { Command } from "./types/commands";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

export const playerManager = new PlayerManager(config.player);

export const commands: Command[] = [
  addCommand,
  clearCommand,
  helpCommand,
  pauseCommand,
  playCommand,
  queueCommand,
  resumeCommand,
  shuffleCommand,
  skipCommand,
  songCommand,
  stopCommand,
  setVolumeCommand,
];

registerReadyListener(client, commands);
registerInteractionCreateListener(client);

client.login(config.app.clientToken);
