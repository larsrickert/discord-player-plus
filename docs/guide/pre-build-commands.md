# Pre-build commands

`discord-player-plus` provides pre-built slash commands for all of its functionality to speed up your discord bot development.

```ts
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
  Command,
} from "discord-player-plus";

// pre-built commands for basic player functions
const slashCommands: Command[] = [
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

// automatically generate a help slash command with details about all the commands above
slashCommands.push(
  createHelpCommand(playerManager, {
    slashCommands,
    // your information here
    author: {
      name: "John Doe",
      url: "https://example.com",
      iconUrl: "https://example.com/img/avatar.png",
    },
    title: "Example bot for discord-player-plus",
    url: "https://github.com/larsrickert/discord-player-plus",
  })
);
```

That's it. Your discord bot now features the most commonly used music player commands out of the box.

## Customizing command messages

### Output visibility

The pre-built slash commands send messages to inform the user about successful / failed execution of the command. You can set the visibility of those messages for each command, e.g.:

```ts
createPlayCommand(playerManager, {
  ephemeral: false,
  ephemeralError: true,
});
```

Ephemeral means that only the user that executed the command will see the output. If `false`, everyone on the server will see the command output.

### Internationalization

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
  // ...
  translations: customTranslations,
});
```
