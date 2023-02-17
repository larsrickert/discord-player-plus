# Pre-build Slash Commands

`discord-player-plus` provides pre-build discord slash commands for its core functionality. However, the commands API is not restricted to those commands and can be extended by your own commands. This provides a clean and standardized command development.

For more information, a full list of available commands and examples, please visit the [API reference](/api/commands).

## Usage

```ts
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

const playerManager = new PlayerManager({
  playerDefault: {
    initialVolume: 50,
  },
});

// pre-built commands for basic player functions
const slashCommands: Command[] = [
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

// automatically generate a help slash command with details about all the commands above
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
  })
);
```

That's it. Your discord bot now features the most commonly used music player commands out of the box.

## Output visibility

The pre-built slash commands send messages to inform the user about successful / failed execution of the command. You can set the visibility of those messages for each command, e.g.:

```ts
createPlayCommand(playerManager, {
  ephemeral: false,
  ephemeralError: true,
});
```

Ephemeral means that only the user that executed the command will see the output. If `false`, everyone on the server will see the command output.

## Internationalization

The messages for pre-build commands will use Englisch by default. Supported languages are:

- English
- German

For additional languages or modifications to existing ones, you need to translate them on your own an pass them as option when creating the `PlayerManager`. Here is an example for changing messages for the default English translations:

```ts
import { PlayerManager, en, Translations } from "discord-player-plus";

const customTranslations: Translations = en;

// change a specific message
customTranslations.global.unsupportedCommand =
  '❌ I dont know your requested command "{command}"!';

const playerManager = new PlayerManager({
  translations: customTranslations,
});
```

::: info Message placeholders
As you can see in the above example, some messages support placeholders that you can use in your custom messages to insert e.g. the track title. Placeholders are placed inside curly brackets. For a full list of supported placeholders for each message, please see the [English tranlsation](https://github.com/larsrickert/discord-player-plus/blob/main/src/languages/en.json) as reference.
:::
