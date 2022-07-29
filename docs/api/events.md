# Events

Both the [PlayerManager](/api/core#playermanager) and each [Player](/api/core#player) provide a few events you can listen to. If listening for those events on the `PlayerManager`, all events will get the guild id as their first argument. The available events are:

<<< @/../src/types/player.ts#PlayerEvents

## Example

```ts
import { PlayerManager } from "discord-player-plus";

const playerManager = new PlayerManager();

// listen for all guilds
playerManager.on("trackStart", (guildId, track) => {
  console.log(`Started track ${track.title} in guild ${guildId}`);
});

// listen for individual guild/player
const player = playerManager.get("MY_GUILD_ID");
player.on("trackStart", (track) => {
  console.log(`Started track ${track.title}`);
});
```

::: info
If you only want to listen to an event once use `.once()` instead of `.on()`.
:::
