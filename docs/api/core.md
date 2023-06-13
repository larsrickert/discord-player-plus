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

  const searchResult = await player.search("Luis Fonsi - Despacito");
  if (searchResult?.tracks.length) {
    await player.play({
      channel: voiceChannel,
      // play first matched song for Despacito
      tracks: searchResult.tracks[0],
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

  const searchResult = await player.search("Some YouTube Playlist");
  if (searchResult?.tracks.length) {
    await player.add({
      channel: voiceChannel,
      tracks: searchResult.tracks,
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
  const searchResult = await player.search("Luis Fonsi - Despacito");
  if (!searchResult?.tracks.length) {
    console.log("No search results found for Despacito");
  } else {
    console.log(
      `Found ${searchResult.tracks.length} matching tracks for Despacito`
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

### jump()

Jumps to the queued track at the specific index and skip all tracks before the index.
Will play the track immediately and stop the current track (if any).

- **Type**

  ```ts
  async jump(index: number): Promise<boolean>
  ```

- **Example**

  ```ts
  const success = await playerManager.jump(3);
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

`discord-player-plus` provides some [built-in engines](/guide/engines) but they can be overridden or extended.

- **Type**

  <<< @/../src/types/engines.ts#PlayerEngine

  - **Example**

  ```ts
  import { PlayerEngine } from "discord-player-plus";

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
  ```

## Interfaces

### PlayerManagerOptions

<<< @/../src/types/player.ts#PlayerManagerOptions

### PlayerOptions

<<< @/../src/types/player.ts#PlayerOptions

### Translations

For available translations see [here](https://github.com/larsrickert/discord-player-plus/blob/main/src/languages/en.json).

### PlayOptions

<<< @/../src/types/player.ts#PlayOptions

Type `VoiceBasedChannel` is imported from `discord.js` library.

### Track

<<< @/../src/types/engines.ts#Track

### Playlist

<<< @/../src/types/engines.ts#Playlist

### SearchOptions

<<< @/../src/types/engines.ts#SearchOptions

### SearchResult

<<< @/../src/types/engines.ts#SearchResult

### PlayerRepeatMode

<<< @/../src/types/player.ts#PlayerRepeatMode

### TrackStream

<<< @/../src/types/engines.ts#TrackStream

Type `StreamType` is imported from `discord.js` library.
