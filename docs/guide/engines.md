---
outline: deep
---

# Player engines

Player engines are the heart of `discord-player-plus`. They are responsible for searching tracks and streaming them using different streaming providers such as YouTube or Spotify.

When you use `player.search()` the engine will be detected automatically but you can also specify which engine you want to use with:

```ts
const searchResult = await player.search("my song to search", {
  source: "spotify",
});
```

If no engine is found for your search, YouTube will be used as fallback.

## Built-in engines

Following player engines are provided by `discord-player-plus` out-of-the-box:

### YouTube

- Default engine
- Search and play tracks and playlists by url or title
- Supports YouTube Music.

### Spotify

- Search tracks and playlists by url
- **YouTube mapping:** Spotify does not provide a web API to stream tracks so they are only searched on Spotify but streamed on YouTube
- **Limitations:** Tracks can only be searched by URL, not by title. Also when searching playlists, only the first 100 tracks will be searched

### Local files

- Search and play local files by file path on your file system, e.g. `./files/my-music.mp3`
- Supports file metadata (will extract e.g. title and artists from the file if available)

The pre-build `/play` and `/add` command allow you to search local songs by using the file path as query. You can also create your track object manually and set the file path as `url` and set the `source` property to `file`.

#### Set file root

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

## Custom engines

You can use custom engines to override existing ones or add additional streaming providers. Custom player engines have higher priority than built-in ones so if you add a custom engine that is responsible for tracks that a built-in engine is responsible for, your engine will be used instead.

::: info
If you are planning to add a player engine for a new streaming provider, please feel free to contribute to `discord-player-plus` by [creating a pull request](https://github.com/larsrickert/discord-player-plus/pulls) that adds the engine to the library so others can use it too.
:::

```ts
import { PlayerEngine, PlayerManager } from "discord-player-plus";

const myCustomEngine: PlayerEngine = {
  source: "vimeo",
  isResponsible(query) {
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
