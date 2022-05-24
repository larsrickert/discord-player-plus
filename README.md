# Discord Player Plus

Library for quickly creating discord music and sound bots using discord.js v13.

**WORK IN PROGRESS! Latest pre-release (non-stable) version can be found in alpha branch**

## Features

- Pre-build slash commands with multiple/custom languages
- No need to install additional dependencies
- Written in TypeScript
- Support for YouTube, Spotify, local files and custom engines
- Multiple servers / guilds

## Usage

You can find an example bot written in TypeScript inside the [`example`](./example/) folder.

### With pre-build slash commands

```js
// create your discord client here
import { Client, Intents } from "discord.js";
import {
  createAddCommand,
  createClearCommand,
  createHelpCommand,
  createPauseCommand,
  createPlayCommand,
  createQueueCommand,
  createResumeCommand,
  createSetVolumeCommand,
  createShuffleCommand,
  createSkipCommand,
  createSongCommand,
  createStopCommand,
  PlayerManager,
  handleSlashCommand,
} from "discord-player-plus";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// the player manager is responsible for multiple guilds/discord servers
const playerManager = new PlayerManager({
  playerDefault: {
    initialVolume: 50,
  },
});

// use different pre-build slash commands
// but you can also add your own custom commands here
export const commands = [
  createAddCommand(playerManager),
  createClearCommand(playerManager),
  createPauseCommand(playerManager),
  createPlayCommand(playerManager),
  createQueueCommand(playerManager),
  createResumeCommand(playerManager),
  createShuffleCommand(playerManager),
  createSkipCommand(playerManager),
  createSongCommand(playerManager),
  createStopCommand(playerManager),
  createSetVolumeCommand(playerManager),
];

// automatically generate a help slash command with details about all commands
commands.push(
  createHelpCommand(playerManager, {
    commands,
    author: {
      name: "John Doe",
      url: "https://example.com",
      iconUrl: "https://example.com/img/avatar.png",
    },
    title: "Example bot for discord-player-plus",
    url: "https://github.com/larsrickert/discord-player-plus",
  })
);

// register the slash commands
client.on("ready", async (client) => {
  console.log(`Bot ready and logged in as ${client.user.tag}`);
  await client.application.commands.set(commands);
  client.user.setActivity({ name: "I am playing music", type: "LISTENING" });
});

// run slash command when user executes it
client.on("interactionCreate", async (interaction) => {
  await handleSlashCommand(interaction, playerManager, commands);
});

client.login("DISCORD_CLIENT_TOKEN");

// thats it, your users can now use a discord music bot with slash commands like /play, /skip, /setvolume etc.
```

#### Internationalization

When using the pre-build slash commands, you can customize every message that is send to the user. The library ships with Englisch and German defaults but you can also pass in your custom language.

```js
import { de } from "discord-player-plus";

// ...

// en is used by default, to use e.g. German:
const playerManager = new PlayerManager({
  // ...
  translations: de,
});
```

If you want to use a custom language you need to translate all messages on your own (see en or de default for required translations):

```js
// ...

const myLanguage = {
  // ...
};

// use a custom language
const playerManager = new PlayerManager({
  // ...
  translations: myLanguage,
});

// ...
```

### Without pre-build slash commands

```js
// create your discord client here
import { Client, Intents } from "discord.js";
import { PlayerManager, handleSlashCommand } from "discord-player-plus";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// the player manager is responsible for multiple guilds/discord servers
const playerManager = new PlayerManager({
  playerDefault: {
    initialVolume: 50,
  },
});

const myCommand = {
  name: "pause",
  description: "Pauses the music bot",
  run: async (interaction) => {
    const player = playerManager.find(interaction.guildId);
    if (!player) {
      return await interaction.reply({
        content: "🤖 I am currently not playing anything.",
        ephemeral: true,
      });
    }

    const paused = player.setPause(true);
    if (!paused) {
      return await interaction.reply({
        content: "❌ Unable to pause current song.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: "⏸️ Song paused.",
    });
  },
};

export const commands = [myCommand];

// register the slash commands
client.on("ready", async (client) => {
  console.log(`Bot ready and logged in as ${client.user.tag}`);
  await client.application.commands.set(commands);
  client.user.setActivity({ name: "I am playing music", type: "LISTENING" });
});

// run slash command when user executes it
client.on("interactionCreate", async (interaction) => {
  await handleSlashCommand(interaction, playerManager, commands);
});

client.login("DISCORD_CLIENT_TOKEN");
```

## Player engines

Player engines are the hearth of discord-player-plus. They are responsible for searching tracks and streaming them using different streaming providers such as YouTube or Spotify. Following player engines are built-in:

- YouTube
- Spotify (Spotify does not provide a web API to stream tracks so they are only searched on Spotify but streamed on YouTube)
- Files (local files on your file system, e.g. `my-music.mp3`)

When you use `player.search()` the engine will be detected automatically but you can also specify which engine you want to use with `player.search("my song to search", { source: "spotify" });`.
