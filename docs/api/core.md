---
outline: deep
---

# Core API

## PlayerManager

The PlayerManager should only exist once in your application and is responsible for managing the different [players](#player) for multiple guilds/discord servers so you don't have to manage them on your own.

- **Type**

  ```ts
  constructor(options?: PlayerManagerOptions)
  ```

  For available options see [PlayerManagerOptions](#playermanageroptions).

- **Example**

  ```ts
  import { PlayerManager } from "discord-player-plus";

  const playerManager = new PlayerManager();
  ```

### get()

Gets an existing player for the given guild id or creates one if it does not exist.

- **Type**

  ```ts
  get(guildId: string, optionOverrides?: Partial<PlayerOptions>): Player
  ```

- **Details**
  `optionOverrides` parameter can be used to specify player options for individual guild players. They will be deep merged with options passed to the [PlayerManager](#playermanager).

  For available player options see [PlayerOptions](#playeroptions).

- **Example**

  ```ts
  const player = playerManager.get("my-guild-id");
  ```

### find()

Gets the player for the given guildId if it exists. Does not create a player.

- **Type**

  ```ts
  find(guildId: string): Player | undefined
  ```

- **Example**

  ```ts
  const player = playerManager.find("my-guild-id");
  if (player) {
    // do stuff
  }
  ```

### remove()

Removes and stops the player for the given guildId (if any).

- **Type**

  ```ts
  remove(guildId: string): void
  ```

- **Example**

  ```ts
  playerManager.remove("my-guild-id");
  ```

### options

[PlayerManagerOptions](#playermanageroptions) passed on creation.

- **Type**

  ```ts
  public readonly options: PlayerManagerOptions | undefined
  ```

### translations

[Translations](#translations-1) used for pre-built slash commands. Using English translations as default.

- **Type**

  ```ts
  public readonly translations: Translations
  ```

## Player

A player is responsible for the audio playback for **one** specific guild/discord server. There should only exist one player per guild in your application.

- **Type**

  ```ts
  constructor(guildId: string, options?: PlayerOptions)
  ```

  For available player options see [PlayerOptions](#playeroptions).

- **Example**

  ```ts
  import { Player } from "discord-player-plus";

  const player = new Player("my-guild-id");
  ```

### play()

Immediate plays the first of the given tracks, skips current track if playing. The remaining tracks will be added to the front of the queue. If no tracks provided, will play first queued track if available.

- **Type**

  ```ts
  async play(options: PlayOptions): Promise<void>
  ```

  For available play options see [PlayOptions](#playoptions).

- **Example**

  ```ts
  // get your voice channel here, e.g. from a slash command
  const voiceChannel;

  const searchResults = await player.search("Luis Fonsi - Despacito");
  if (searchResults.length && searchResults[0].tracks.length) {
    await player.play({
      channel: voiceChannel,
      // play first matched song for Despacito
      tracks: searchResults[0].tracks.slice(1),
    });
  }
  ```

### add()

Adds the given tracks to the end of the queue. Immediately plays first track in queue if currently not playing.

- **Type**

  ```ts
  async add(options: PlayOptions): Promise<void>
  ```

  For available play options see [PlayOptions](#playoptions).

- **Example**

  ```ts
  // get your voice channel here, e.g. from a slash command
  const voiceChannel;

  const searchResults = await player.search("Some YouTube Playlist");
  if (searchResults.length && searchResults[0].tracks.length) {
    await player.add({
      channel: voiceChannel,
      tracks: searchResults[0].tracks,
    });
  }
  ```

### clear()

Clears queue and returns number of cleared tracks. Does not stop current track.

- **Type**

  ```ts
  clear(): number
  ```

- **Example**

  ```ts
  player.clear();
  ```

### skip()

Skips the current track if playing. Returns skipped track, if any.

- **Type**

  ```ts
  skip(): Track | undefined
  ```

- **Example**

  ```ts
  const skippedTrack = player.skip();
  if (skippedTrack) {
    console.log("Skipped track", track);
  }
  ```

### setPause()

Pauses or resumes the current track. Returns `true` if paused/resumed, `false` otherwise. Will return `true` if you try to pause/resume but player is already paused/resumed.

- **Type**

  ```ts
  setPause(shouldPause: boolean): boolean
  ```

- **Example**

  ```ts
  const paused = player.setPause(true);
  if (paused) {
    console.log("Player is paused");
  }
  ```

  ```ts
  const resumed = player.setPause(false);
  if (resumed) {
    console.log("Player is resumed");
  }
  ```

### isPaused()

Whether the player is currently paused.

- **Type**

  ```ts
  isPaused(): boolean
  ```

- **Example**

  ```ts
  const isPaused = player.isPaused();
  console.log("Is player paused?", isPaused);
  ```

### isPlaying()

Whether the player is currently actively playing an audio resource.

- **Type**

  ```ts
  isPlaying(): boolean
  ```

- **Example**

  ```ts
  const isPlaying = player.isPlaying();
  console.log("Is player playing?", isPlaying);
  ```

### shuffle()

Randomly shuffles the current queue.

- **Type**

  ```ts
  shuffle(): void
  ```

- **Example**

  ```ts
  player.shuffle();
  ```

### getCurrentTrack()

Gets the currently playing track, if any.

- **Type**

  ```ts
  getCurrentTrack(): Track | undefined
  ```

- **Example**

  ```ts
  const track = player.getCurrentTrack();
  if (track) {
    console.log("Current track:", track);
  }
  ```

### getQueue()

Gets a list of queued tracks.

- **Type**

  ```ts
  getQueue(): Track[]
  ```

- **Example**

  ```ts
  const tracks = player.getQueue();
  console.log("Queued tracks:", tracks.length);
  ```

### setVolume()

Sets the player volume for all tracks. Requires `inlineVolume` in player options to be `true` (default).

- **Type**

  ```ts
  setVolume(volume: number): boolean
  ```

  Volume must be between `0` and `200`.

- **Example**

  ```ts
  const updated = player.setVolume(75);
  if (updated) {
    console.log("Changed volume to 75");
  }
  ```

### getVolume()

Gets the current player volume.

- **Type**

  ```ts
  getVolume(): number
  ```

- **Example**

  ```ts
  const volume = player.getVolume();
  console.log("Current volume:", volume);
  ```

### stop()

Stops the player, clears the current queue and disconnects from the voice channel if connected.

- **Type**

  ```ts
  stop(): void
  ```

- **Example**

  ```ts
  player.stop();
  ```

### getPlaybackDuration()

Gets the playback duration (already played time) of the current track in milliseconds.

- **Type**

  ```ts
  getPlaybackDuration(): number
  ```

- **Example**

  ```ts
  const duration = player.getPlaybackDuration();
  console.log(
    `Current track is playing for ${Math.round(duration / 1000)} seconds`
  );
  ```

### search()

Searches tracks for the given query.

- **Type**

  ```ts
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  ```

  For available play options see [SearchOptions](#searchoptions).

- **Example**

  ```ts
  const searchResults = await player.search("Luis Fonsi - Despacito");
  if (searchResults.length) {
    console.log("No search results found for Despacito");
  } else {
    console.log(
      `Found ${searchResults[0].tracks.length} matching tracks for Despacito`
    );
  }
  ```

### seek()

Seeks the current track to the given time in milliseconds. Returns `true` if successfully seeked, `false` otherwise.

- **Type**

  ```ts
  async seek(time: number): Promise<boolean>
  ```

- **Example**

  ```ts
  const success = await player.seek(1000 * 30);
  if (success) {
    console.log("Current track seeked to 30 seconds");
  }
  ```

### insert()

Inserts a track at a specific index. Will move current index and following after the inserted track. If index is negative or grater than queue size, will insert at the start/end at the queue accordingly. Will not play the track if queue is empty and currently not playing.

- **Type**

  ```ts
  insert(track: Track, index: number): void
  ```

- **Example**

  ```ts
  // get track, e.g. from search()
  const track;
  player.insert(track, 3);
  ```

### remove()

Removes the queued track at the specific index, if any. Returns removed track (if removed).

- **Type**

  ```ts
  remove(index: number): Track | undefined
  ```

- **Example**

  ```ts
  const track = player.remove(0);
  if (track) {
    console.log("Removed next queued track");
  }
  ```

### setRepeat()

Sets the repeat mode.

- **Type**

  ```ts
  setRepeat(mode: PlayerRepeatMode): void
  ```

  For available repeat modes see [PlayerRepeatMode](#playerrepeatmode).

- **Example**

  ```ts
  import { PlayerRepeatMode } from "discord-player-plus";

  player.setRepeat(PlayerRepeatMode.TRACK);
  ```

### getRepeat()

Gets the current repeat mode.

- **Type**

  ```ts
  getRepeat(): PlayerRepeatMode
  ```

  For available repeat modes see [PlayerRepeatMode](#playerrepeatmode).

- **Example**

  ```ts
  const mode = player.getRepeat();
  console.log("Current repeat mode:", mode);
  ```

### getVoiceChannel()

Gets the voice channel that the player is currently connected to (if any).

- **Type**

  ```ts
  import { VoiceBasedChannel } from "discord.js";
  getVoiceChannel(): VoiceBasedChannel | undefined
  ```

- **Example**

  ```ts
  const channel = player.getVoiceChannel();
  if (channel) {
    console.log(`Currently playing in channel ${channel.name}`);
  }
  ```

### guildId

The guild/discord server id passed on player creation.

- **Type**

  ```ts
  readonly guildId: string
  ```

### options

The options passed on player creation.

- **Type**

  ```ts
  readonly options: PlayerOptions
  ```

For available player options see [PlayerOptions](#playeroptions).

## PlayerEngine

Player engines are the heart of `discord-player-plus`. They are responsible for searching and streaming tracks from streaming providers like YouTube or Spotify.

`discord-player-plus` provides some default engines but they can be overridden or extended.

- **Type**

  ```ts
  interface PlayerEngine {
    /** Source (e.g. "youtube", "spotify" etc.) */
    source: string;
    /**
     * Whether this engine is responsible for searching/streaming the given query.
     * If no available engines are responsible for a user query, YouTube will be used.
     */
    isResponsible(
      query: string,
      playerOptions: PlayerOptions
    ): boolean | Promise<boolean>;
    /** Gets information about the given query. */
    search(
      query: string,
      playerOptions: PlayerOptions,
      options?: SearchOptions
    ): Promise<SearchResult[]>;
    /** Gets the playable stream for the given track. */
    getStream(
      track: Track,
      playerOptions: PlayerOptions
    ): Promise<TrackStream | null>;
  }
  ```

  - **Example**

  ```ts
  import { PlayerEngine } from "discord-player-plus";

  const youtubeEngine: PlayerEngine = {
    source: "youtube",
    isResponsible(query) {
      return query.startsWith("https://www.youtube.com");
    },
    async search(query, playerOptions, searchOptions) {
      // search on YouTube
      return [];
    },
    async getStream(track, playerOptions) {
      // get stream from YouTube
      return null;
    },
  };
  ```

## Interfaces

### PlayerManagerOptions

```ts
interface PlayerManagerOptions {
  /** Player options that should be applied for all guilds. Guild specific options can be overridden when calling `playerManager.get(guildId)`. */
  playerDefault?: PlayerOptions;
  /** Translations for the pre-build commands. Default: en */
  translations?: Translations;
}
```

### PlayerOptions

````ts
interface PlayerOptions {
  /**
   * Audio quality.
   *
   * @default "high"
   */
  quality?: "low" | "medium" | "high";
  /**
   * Setting to `true` will enable the player to change the volume of the played tracks.
   * Set to `false` for slightly better performance.
   *
   * @default true
   */
  inlineVolume?: boolean;
  /**
   * Initial player volume for all tracks between 0 and 200. Can also be an (async) function that returns the volume.
   */
  initialVolume?: number | ((guildId: string) => number | Promise<number>);
  /**
   * Path to the folder where local files should be playable from. Must be set if local files should be playable.
   * For security reasons files outside this directory are refused to play.
   *
   * @example
   * ```ts
   * // files outside of this public folder wont be playable
   * fileRoot: path.join(__dirname, "../public")
   * ```
   */
  fileRoot?: string;
  /** Custom player engines to provide additional streaming services or override existing ones. */
  customEngines?: Record<string, PlayerEngine>;
  /**
   * When `true` and the player is already playing in voice channel A, player will be allowed to switch to
   * voice channel B. If `false`, player wont connect to another voice channel when he is already playing in a voice channel.
   *
   * @default true
   *
   */
  allowSwitchChannels?: boolean;
  /**
   * When `true`, player will be stopped when there is nothing more to play (track ends, queue is empty and no repeat mode has been set).
   * Otherwise, the player will stay connected to the voice channel and will not play anything.
   *
   * @default `true`
   */
  stopOnEnd?: boolean;
}
````

### Translations

For available translations see [here](https://github.com/larsrickert/discord-player-plus/blob/main/src/languages/en.json).

### PlayOptions

```ts
interface PlayOptions {
  /** Voice channel to play in. */
  channel: VoiceBasedChannel;
  /** Tracks to play / add to queue. */
  tracks: Track[];
  /**
   * If `true` and player is currently playing a track, it will be added to the front of the queue with the current playback duration.
   * Can be used to temporarily play a (short) track.
   */
  addSkippedTrackToQueue?: boolean;
}
```

Type `VoiceBasedChannel` comes from `discord.js` library.

### Track

```ts
interface Track {
  title: string;
  /** Track url. If using local file url/path, set `source` to `file`. */
  url: string;
  thumbnailUrl?: string;
  /** Duration in seconds. */
  duration: number;
  artist?: string;
  /**
   * Track source (used player engine). Built-in engines/sources: `youtube`, `spotify`, `file`.
   *
   * @example "youtube"
   */
  source: string;
  playlist?: Playlist;
  /** Number of milliseconds to seek/skip. */
  seek?: number;
}
```

### Playlist

```ts
interface Playlist {
  title: string;
  url: string;
  thumbnailUrl?: string;
}
```

### SearchOptions

```ts
interface SearchOptions {
  /**
   * The source where tracks should be searched. If not provided, will automatically detect the source or fall back to YouTube.
   */
  source?: string;
  /**
   * Limit number of tracks to search.
   * Not supported when searching single Spotify track. Due to Spotify limitations, only first 100 playlist tracks are searched.
   */
  limit?: number;
}
```

### SearchResult

```ts
interface SearchResult {
  tracks: Track[];
  playlist?: Playlist;
  source: string;
}
```

### PlayerRepeatMode

```ts
enum PlayerRepeatMode {
  /** No tracks are repeated (default) */
  NONE,
  /** Repeat currently playing track */
  TRACK,
}
```

### TrackStream

```ts
interface TrackStream {
  /**
   * If the input is given as a string, then the inputType option will be overridden and FFmpeg will be used.
   * Can be used as file path when playing local files.
   */
  stream: Readable | string;
  type?: StreamType;
}
```

Type `StreamType` comes from `discord.js` library.
