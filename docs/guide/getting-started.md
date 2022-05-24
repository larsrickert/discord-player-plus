# Getting Started

This section will help you build a basic discord music bot from ground up. If you already have an existing project, start from step 3.

## Project setup

- **Step 1:** Create and change into a new directory.

```bash
mkdir discord-music-bot && cd discord-music-bot
```

- **Step 2:** Initialize a new npm package with defaults.

```bash
npm init -y
```

- **Step 3:** Install `discord-player-plus` and `discord.js`.

```bash
npm i discord.js discord-player-plus
```

- **Step 4 (optional):** Install TypeScript.

I recommended using TypeScript instead of plain JavaScript to get type safety. `discord-player-plus` is written in TypeScript so it fully types, if you decide to only use JavaScript your IDE will give you intellisense. For the rest of this documentation I will assume that you use TypeScript.

```bash
npm i -D typescript @types/node
```

- **Step 5:** Add some options to `package.json`.

```json
{
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node ."
  }
}
```

- **Step 6:** Add `tsconfig.json`.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "strict": true,
    "moduleResolution": "node",
    "paths": {
      "*": ["node_modules/*"]
    }
  },
  "include": ["src/**/*"]
}
```

## Create discord client

- **Step 7:** Create the discord bot client inside file `src/index.ts`.

```bash
mkdir src && touch src/index.ts
```

Add the following content:

```ts
import { Client, Intents } from "discord.js";
import { Command } from "discord-player-plus";

// this is the discord client for your music bot
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// put all slash commands that your bot offers in here
// we will add them in a later step
const slashCommands: Command[] = [];

// register the slash commands when the bot is started
client.on("ready", async (client) => {
  console.log(`Bot ready and logged in as ${client.user.tag}`);
  await client.application.commands.set(slashCommands);

  // (optional) set bot status that is being displayed below the user in discord on the right
  client.user.setActivity({ name: "Playing music", type: "LISTENING" });
});

// actually login the discord bot
// important: you should not expose your discord client token in your git repository.
// you can e.g. use dotenv (https://www.npmjs.com/package/dotenv) for this and add the .env file
// to your .gitignore
client.login("DISCORD_CLIENT_TOKEN");
```

## Create the PlayerManager

- **Step 8:** Create the `PlayerManager` from `discord-player-plus`.

The `PlayerManager` should only exist once in your application and is responsible for managing the different music players for multiple guilds/discord servers so you don't have to manage them on your own.

Inside the `src/index.ts` above `client.login()`:

```ts
import { handleSlashCommand, PlayerManager } from "discord-player-plus";

// you can set player settings that apply to each guild
const playerManager = new PlayerManager({
  playerDefault: {
    initialVolume: 50,
  },
});

// the interactionCreate event is emitted when a user executes a slash command
// here, we want to run our commands
client.on("interactionCreate", async (interaction) => {
  // the handleSlashCommand helper is provided by discord-player-plus and checks if the given slash command
  // is supported and executes it accordingly.
  await handleSlashCommand(interaction, playerManager, slashCommands);
});
```

## Create commands

Now we want to add slash commands to the `slashCommands` array that we already defined in [Step 7](#create-discord-client). `discord-player-plus` provides [pre-build slash commands](/guide/pre-build-commands.html) for all its core functions.

Here is an example for creating a custom command:

```ts
import { Command } from "discord-player-plus";

const myCustomCommand: Command = {
  name: "mycommand",
  description: "Does some cool stuff",
  // the run method is the execution point of the command
  // it is called by the `handleSlashCommand` helper that we defined earlier
  run: async (interaction) => {
    const player = playerManager.find(interaction.guildId);
    if (!player || !player.isPlaying()) {
      return await interaction.reply({
        content: "🤖 I am currently not playing anything.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `I am playing the current song since ${Math.round(player.getPlaybackDuration())}`
      ephemeral: true,
    });
  },
};
```
