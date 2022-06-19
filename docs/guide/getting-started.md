# Getting Started

This section will help you installing `discord-player-plus` to use it as a discord bot.

## Step 1: Installation

Install `discord-player-plus` and `discord.js`.

```bash
npm i discord.js discord-player-plus
```

## Step 2: Create discord client

You need to create a discord client for your bot to interact with the discord API.

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

## Step 3: Create the PlayerManager

The `PlayerManager` should only exist once in your application and is responsible for managing the different music players for multiple guilds/discord servers so you don't have to manage them on your own.

Extend the code from [step 2](#step-2-create-discord-client) by adding the following code above `client.login()`:

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
  await handleSlashCommand(
    interaction,
    slashCommands,
    playerManager.translations
  );
});
```

## Step 4: Create commands

Now we want to add slash commands to the `slashCommands` array that we already defined in [Step 2](#step-2-create-discord-client). `discord-player-plus` provides [pre-build slash commands](/guide/commands) for all its core functionality.

However, here is an example for creating a custom command:

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
      await interaction.reply({
        content: "🤖 I am currently not playing anything.",
        ephemeral: true,
      });
      return false;
    }

    await interaction.reply({
      content: `I am playing the current song since ${Math.round(player.getPlaybackDuration() / 1000)} seconds`
      ephemeral: true,
    });
    return true;
  },
};

slashCommands.push(myCustomCommand);
```
