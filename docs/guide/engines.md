# Player engines

Player engines are the heart of `discord-player-plus`. They are responsible for searching tracks and streaming them using different streaming providers such as YouTube or Spotify. Following player engines are built-in:

- YouTube
- Spotify (Spotify does not provide a web API to stream tracks so they are only searched on Spotify but streamed on YouTube)
- Files (local files on your file system, e.g. `my-music.mp3`)

When you use `player.search()` the engine will be detected automatically but you can also specify which engine you want to use with:

```ts
const searchResults = await player.search("my song to search", {
  source: "spotify",
});
```

If no engine is found for your search, YouTube will be used as fallback.

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

## Custom engines

You can use custom engines to override existing ones or add additional streaming providers. Custom player engines have higher priority than build-in ones so if you add a custom engine that is responsible for tracks that a build-in engine is responsible for, your engine will be used instead.

::: info
If you are planning to add a player engine for a new streaming provider, please feel free to contribute to `discord-player-plus` by [creating a pull request](https://github.com/larsrickert/discord-player-plus/pulls) that adds the engine to the library so others can use it too.
:::

```ts
import { PlayerEngine, PlayerManager } from "discord-player-plus";

const myCustomEngine: PlayerEngine = {
  source: "vimeo",
  async isResponsible(query) {
    // can also be async
    return query.startsWith("https://player.vimeo.com/video");
  },
  async search(query, playerOptions, searchOptions) {
    // put your code here that searches the query on vimeo
    return [];
  },
  async getStream(track, playerOptions) {
    // get stream from vimeo
    return null;
  },
};

// add custom engine to all players via the player manager
const playerManager = new PlayerManager({
  playerDefaults: {
    customEngines: {
      vimeo: myCustomEngine,
    },
  },
});
```

You can now search on/stream from vimeo using `player.search()` or by explicitly setting a track's source to `vimeo`.
