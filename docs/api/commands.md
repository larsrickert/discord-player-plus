---
outline: deep
---

# Slash Commands API

`discord-player-plus` provides pre-defined discord slash commands for its core functionality. However, the commands API is not restricted to those commands and can be extended by your own commands. This provides a clean and standardized command development.

## Command

A command extends the default command type provided by `discord.js` with a `run` method that encapsulates the logic of each slash command.

- **Type**

  ```ts
  import {
    ChatInputApplicationCommandData,
    CommandInteraction,
  } from "discord.js";

  interface Command<T = boolean> extends ChatInputApplicationCommandData {
    run: (interaction: CommandInteraction<"cached">) => Promise<T>;
  }
  ```

  By default all commands expect the `run` method to return a Promise with a boolean that indicates whether the command has been executed successfully.

- **Example**

  ```ts
  import { PlayerManager, Command } from "discord-player-plus";

  const playerManager = new PlayerManager();

  const pauseCommand: Command = {
    name: "pause",
    description: "Pauses the player.",
    run: async (interaction) => {
      const player = playerManager.find(interaction.guildId);
      if (!player) {
        await interaction.reply({
          content: "🤖 I am currently not playing anything.",
          ephemeral: true,
        });
        return false;
      }

      const paused = player.setPause(true);
      if (!paused) {
        await interaction.reply({
          content: "❌ Unable to pause current song.",
          ephemeral: true,
        });
        return false;
      }

      await interaction.reply({
        content: "⏸️ Song paused.",
      });
      return true;
    },
  };
  ```

  ### handleSlashCommand()

  Helper function to execute slash commands for a given interaction from discord.js. Will check if command is supported, calls its `run` method and handles unexpected errors.

- **Type**

  ```ts
  /**
   * @param discord.js interaction received by `client.on("interactionCreate")`.
   * @param commands All available slash commands that should be executable.
   * @param translations Translations used for error messages (e.g. unknown command).
   */
  async function handleSlashCommand(
    interaction: Interaction,
    commands: Command[],
    translations: Translations
  ): Promise<void>;
  ```

  - **Example**

  ```ts
  import {
    Command,
    handleSlashCommand,
    PlayerManager,
  } from "discord-player-plus";
  import { Client, Intents } from "discord.js";

  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  const playerManager = new PlayerManager();

  // add commands here, e.g. pre-defined commands from discord-player-plus or custom commands
  const slashCommands: Command[] = [];

  client.on("ready", async (client) => {
    console.log(`Bot ready and logged in as ${client.user.tag}`);
    await client.application.commands.set(slashCommands);
  });

  client.on("interactionCreate", async (interaction) => {
    await handleSlashCommand(interaction, playerManager, slashCommands);
  });
  ```

## Pre-defined commands

### createAddCommand()

Creates a `/add` command for adding tracks to the queue.

- **Type**

  ```ts
  function createAddCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createAddCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createAddCommand(playerManager)];
  ```

### createClearCommand()

Creates a `/clear` command for clearing queued tracks.

- **Type**

  ```ts
  function createClearCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createClearCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createClearCommand()];
  ```

### createHelpCommand()

Creates a `/help` command for showing all available commands and bot metadata.

- **Type**

  ```ts
  function createHelpCommand(
    playerManager: PlayerManager,
    options?: CreateHelpCommandOptions
  ): Command;
  ```

  For available options see [CreateHelpCommandOptions](#createhelpcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createHelpCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();

  // other commands
  const slashCommands: Command[] = [];

  slashCommands.push(
    createHelpCommand(playerManager, {
      slashCommands,
      title: "Example bot for discord-player-plus",
      url: "https://github.com/larsrickert/discord-player-plus",
      description:
        "This an example help command to show you all available commands.",
      author: {
        name: "Lars Rickert",
        url: "https://lars-rickert.de",
        iconUrl: "https://avatars.githubusercontent.com/u/67898185?v=4",
      },
      footerText: "Thanks for using discord-player-plus",
    })
  );
  ```

### createPauseCommand()

Creates a `/pause` command for pausing the current track.

- **Type**

  ```ts
  function createPauseCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createPauseCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createPauseCommand()];
  ```

### createPlayCommand()

Creates a `/play` command for immediately searching and playing a track. If query is a track, will play first result. If its a playlist, first track will be played and rest will be queued.

- **Type**

  ```ts
  function createPlayCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createPlayCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createPlayCommand()];
  ```

### createQueueCommand()

Creates a `/queue` command for displaying queued tracks.

- **Type**

  ```ts
  function createQueueCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createQueueCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createQueueCommand()];
  ```

### createResumeCommand()

Creates a `/resume` command for resuming the currently paused track.

- **Type**

  ```ts
  function createResumeCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createResumeCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createResumeCommand()];
  ```

### createShuffleCommand()

Creates a `/shuffle` command for shuffling the queue.

- **Type**

  ```ts
  function createShuffleCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createShuffleCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createShuffleCommand()];
  ```

### createSkipCommand()

Creates a `/skip` command for skipping the current track.

- **Type**

  ```ts
  function createSkipCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createSkipCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createSkipCommand()];
  ```

### createSongCommand()

Creates a `/song` command for getting information about the currently played track.

- **Type**

  ```ts
  function createSongCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createSongCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createSongCommand()];
  ```

### createStopCommand()

Creates a `/stop` command for stopping the playback and leaving the voice channel.

- **Type**

  ```ts
  function createStopCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createStopCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createStopCommand()];
  ```

### createSetVolumeCommand()

Creates a `/setvolume` command for setting the player volume between 0 and 200.

- **Type**

  ```ts
  function createSetVolumeCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createSetVolumeCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createSetVolumeCommand()];
  ```

### createRepeatCommand()

Creates a `/repeat` command for setting the repeat mode.

- **Type**

  ```ts
  function createRepeatCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createRepeatCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createRepeatCommand()];
  ```

### createSeekCommand()

Creates a `/seek` command for seeking the current track to a specific duration.

- **Type**

  ```ts
  function createSeekCommand(
    playerManager: PlayerManager,
    options?: CreateCommandOptions
  ): Command;
  ```

  For available options see [CreateCommandOptions](#createcommandoptions).

  - **Example**

  ```ts
  import {
    Command,
    createSeekCommand,
    PlayerManager,
  } from "discord-player-plus";

  const playerManager = new PlayerManager();
  const slashCommands: Command[] = [createSeekCommand()];
  ```

## Interfaces

Options for creating pre-defined commands from `discord-player-plus`.

### CreateCommandOptions

```ts
interface CreateCommandOptions {
  /**
   * Whether messages should only be visible for the user that executed the command.
   *
   * @default `false`
   */
  ephemeral?: boolean;
  /**
   * Whether error messages should only be visible for the user that executed the command.
   *
   * @default `true`
   */
  ephemeralError?: boolean;
}
```

### CreateHelpCommandOptions

```ts
interface CreateHelpCommandOptions {
  /** Title that is being displayed at the top of the help prompt. Markdown supported. */
  title?: string;
  /** URL that the title should be linked to. */
  url?: string;
  /** Description/text inside the help prompt. Markdown supported. */
  description?: string;
  /** Commands that the help prompt should be generated for. Will be sorted alphabetically. */
  commands: Command[];
  /** Information about the author that developed the discord bot. */
  author?: {
    name: string;
    iconUrl?: string;
    url?: string;
  };
  /** Footer text, e.g. to specify the discord bot version. */
  footerText?: string;
}
```
