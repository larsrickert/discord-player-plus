# Player engines

Player engines are the hearth of discord-player-plus. They are responsible for searching tracks and streaming them using different streaming providers such as YouTube or Spotify. Following player engines are built-in:

- YouTube
- Spotify (Spotify does not provide a web API to stream tracks so they are only searched on Spotify but streamed on YouTube)
- Files (local files on your file system, e.g. `my-music.mp3`)

When you use `player.search()` the engine will be detected automatically but you can also specify which engine you want to use with:

```ts
const searchResults = await player.search("my song to search", {
  source: "spotify",
});
```

## Local files

You can also play local files from your filesystem by setting the file path as the track url or search query. The üre-build `/play` and `/add` command allow you to search local songs by using the file path as query.

### Set file root

::: warning
For security reasons you have to set `fileRoot` of the player options. Only local files inside this folder are allowed to play. In the following example only files inside `../path/to/my/folder` will be playable.
:::

```ts
import { PlayerManager } from "discord-player-plus";
import path from "path";

const playerManager = new PlayerManager({
  playerDefaults: {
    fileRoot: path.join(__dirname, "../path/to/my/folder"),
  },
});
```

### Play file

- Using `player.search()`:

  ```ts
  // get voice channel from e.g. slash command interaction
  const voiceChannel;

  const searchResults = await player.search(
    path.join(__dirname, "../path/to/my/folder/example.mp3")
  );

  if (searchResults.length && searchResults[0].tracks.length) {
    await player.play({
      channel: voiceChannel,
      tracks: searchResults[0].tracks.slice(1),
    });
  }
  ```

- Using manually created track:

  You need to set `source` to `file` and the file path as `url`.

  ```ts
  import { Track } from "discord-player-plus";

  // get voice channel from e.g. slash command interaction
  const voiceChannel;

  const track: Track = {
    title: "My local file",
    url: path.join(__dirname, "../path/to/my/folder/example.mp3"),
    duration: 30,
    source: "file",
  };

  await player.play({
    channel: voiceChannel,
    tracks: [track],
  });
  ```
