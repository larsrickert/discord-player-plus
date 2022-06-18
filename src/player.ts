import {
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { TypedEmitter } from "tiny-typed-emitter";
import { playerEngines } from "./engines";
import {
  PlayerEngine,
  SearchOptions,
  SearchResult,
  Track,
} from "./types/engines";
import {
  AudioPlayerMetadata,
  PlayerEvents,
  PlayerOptions,
  PlayerRepeatMode,
  PlayOptions,
} from "./types/player";
import { shuffle, validateVolume } from "./utils/player";

export class Player extends TypedEmitter<PlayerEvents> {
  private readonly audioPlayer = createAudioPlayer();
  private queue: Track[] = [];
  private volume: number | undefined;
  private audioResource: AudioResource<AudioPlayerMetadata> | undefined;
  private repeatMode = PlayerRepeatMode.NONE;

  constructor(
    public readonly guildId: string,
    private readonly options: PlayerOptions = {}
  ) {
    super();

    this.audioPlayer.on<"stateChange">(
      "stateChange",
      async (oldState, newState) => {
        if (
          newState.status === AudioPlayerStatus.Playing &&
          oldState.status !== AudioPlayerStatus.AutoPaused
        ) {
          // new track started
          const resource = newState.resource as typeof this.audioResource;
          if (resource) this.emit("trackStart", resource.metadata.track);
          return;
        }

        if (
          newState.status === AudioPlayerStatus.Idle &&
          oldState.status !== AudioPlayerStatus.Idle
        ) {
          // current track ended
          const nextTrack = await this.getNextTrack();

          // play next queued track
          if (!nextTrack) {
            this.stop();
          } else if (this.audioResource) {
            await this.play({
              channel: this.audioResource.metadata.channel,
              tracks: [nextTrack],
            });
          }

          // trackEnd should be emitted before queueEnd
          this.emit("trackEnd");
          if (!nextTrack) this.emit("queueEnd");
        }
      }
    );
  }

  /** Gets the next track, Considers the current repeat mode. */
  private async getNextTrack(): Promise<Track | undefined> {
    // this method is async to support autoplay and queue repeat in the future
    if (this.repeatMode === PlayerRepeatMode.TRACK) {
      const currentTrack = this.getCurrentTrack();
      if (currentTrack) return currentTrack;
    }

    return this.queue.shift();
  }

  /**
   * Joins the given voice channel (reusing existing connection), subscribes to the audioPlayer and
   * registers events when disconnected and destroyed.
   */
  private join(channel: VoiceBasedChannel): VoiceConnection {
    // check if player is allowed to switch channels when already playing in another voice channel
    if (!(this.options.allowSwitchChannels ?? true)) {
      const currentConnection = getVoiceConnection(channel.guildId);
      if (
        currentConnection &&
        currentConnection.joinConfig.channelId !== channel.id
      ) {
        throw new Error(
          "Refused to join voice channel because player is already connected to another voice channel"
        );
      }
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // subscribing to audioPlayer allows playing music
    const subscription = connection.subscribe(this.audioPlayer);
    connection.removeAllListeners();

    connection
      .on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // seems to be a real disconnect
          connection.destroy();
        }
      })
      .on(VoiceConnectionStatus.Destroyed, () => {
        this.audioPlayer.stop();
        subscription?.unsubscribe();
        this.audioResource = undefined;
        this.emit("destroyed");
      });

    return connection;
  }

  private getEngine(source: string): PlayerEngine | undefined {
    if (this.options.customEngines?.[source]) {
      return this.options.customEngines[source];
    }
    return playerEngines[source];
  }

  /**
   * Immediate plays the first of the given tracks, skips current track if playing.
   * The remaining tracks will be added to the front of the queue.
   * If no tracks provided, will play first queued track if available.
   */
  async play(options: PlayOptions): Promise<void> {
    const track: Track | undefined = options.tracks.length
      ? options.tracks[0]
      : this.queue.shift();
    if (!track) return;

    const inlineVolume = this.options.inlineVolume ?? true;
    const metadata: AudioPlayerMetadata = {
      channel: options.channel,
      track,
    };

    // get playable stream for track
    // check if custom stream engine is provided
    const playerEngine = this.getEngine(track.source);
    if (!playerEngine) {
      throw new Error(`Unknown player engine "${track.source}"`);
    }

    const trackStream = await playerEngine.getStream(
      track,
      this.options,
      options.stream
    );

    if (!trackStream) {
      throw new Error("Unable to create stream for track");
    }

    this.audioResource = createAudioResource(trackStream.stream, {
      inputType: trackStream.type,
      inlineVolume,
      metadata,
    });

    // set player volume
    if (this.volume != null) {
      this.setVolume(this.volume);
    } else {
      const initialVolume =
        typeof this.options.initialVolume === "function"
          ? await this.options.initialVolume(options.channel.guildId)
          : this.options.initialVolume;

      this.setVolume(initialVolume ?? 100);
    }

    this.join(options.channel);
    this.audioPlayer.play(this.audioResource);

    // add the rest of the tracks to the start of the queue
    this.queue.unshift(...options.tracks.slice(1));
  }

  /**
   * Adds the given tracks to the end of the queue. Immediately plays first track in queue if currently not playing.
   */
  async add(options: PlayOptions): Promise<void> {
    this.queue.push(...options.tracks);

    if (
      ![AudioPlayerStatus.Buffering, AudioPlayerStatus.Playing].includes(
        this.audioPlayer.state.status
      )
    ) {
      await this.play({ ...options, tracks: [] });
    }
  }

  /**
   * Clears queue. Does not stop current track.
   *
   * @returns Number of cleared tracks.
   */
  clear(): number {
    const length = this.queue.length;
    this.queue = [];
    return length;
  }

  /**
   * Skips the current track if playing.
   *
   * @returns Skipped track, if any.
   */
  skip(): Track | undefined {
    const currentTrack = this.getCurrentTrack();
    const stopped = this.audioPlayer.stop();
    return stopped ? currentTrack : undefined;
  }

  /**
   * Pauses or resumes the current track.
   *
   * @returns `true` if paused/resumed, `false` otherwise.
   * Will be `true` if you try to pause/resume but player is already paused/resumed.
   */
  setPause(shouldPause: boolean): boolean {
    if (shouldPause && this.isPaused()) return true;
    if (!shouldPause && this.isPlaying()) return true;

    return shouldPause
      ? this.audioPlayer.pause(true)
      : this.audioPlayer.unpause();
  }

  /**
   * Whether the player is currently paused.
   */
  isPaused(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Paused;
  }

  /**
   * Whether the player is currently actively playing an audio resource.
   */
  isPlaying(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  /**
   * Randomly shuffles the current queue.
   */
  shuffle(): void {
    shuffle(this.queue);
  }

  /**
   * Gets the currently playing track, if any.
   */
  getCurrentTrack(): Track | undefined {
    return this.audioResource?.metadata.track;
  }

  /**
   * Gets a list of queued tracks.
   *
   * @returns Copy of the current queue.
   */
  getQueue(): Track[] {
    return this.queue.slice();
  }

  /**
   * Sets the player volume for all tracks.
   *
   * @param volume Volume between 0 and 200.
   * @returns `true` if the volume was set, `false` otherwise.
   */
  setVolume(volume: number): boolean {
    if (!validateVolume(volume) || !this.audioResource?.volume) return false;
    this.volume = volume;
    this.audioResource.volume.setVolume(volume / 100);
    return true;
  }

  /** Gets the current player volume. */
  getVolume(): number {
    return this.volume ?? 100;
  }

  /**
   * Stops the player, clears the current queue and disconnects from the voice channel if connected.
   */
  stop(): void {
    const connection = getVoiceConnection(this.guildId);
    this.clear();
    connection?.destroy();
  }

  /**
   * Gets the playback duration (already played time) of the current track in milliseconds.
   */
  getPlaybackDuration(): number {
    return this.audioResource?.playbackDuration ?? 0;
  }

  private async detectTrackSource(query: string): Promise<string> {
    const entries = Object.entries(this.options.customEngines ?? {}).concat(
      Object.entries(playerEngines)
    );

    for (const [source, engine] of entries) {
      if (await engine.isResponsible(query, this.options)) {
        return source;
      }
    }

    return "youtube";
  }

  /**
   * Searches tracks for the given query.
   *
   * @returns Search result.
   */
  async search(
    query: string,
    options?: SearchOptions
  ): Promise<SearchResult[]> {
    const trackSource =
      options?.source || (await this.detectTrackSource(query));
    const playerEngine = this.getEngine(trackSource);
    if (!playerEngine) return [];
    return await playerEngine.search(query, this.options, options);
  }

  /**
   * Seeks the current track to the given time in milliseconds.
   *
   * @returns `true` if successfully seeked, `false` otherwise.
   */
  async seek(time: number): Promise<boolean> {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack || time < 0 || !this.audioResource) return false;

    if (time / 1000 >= currentTrack.duration) return !!this.skip();

    await this.play({
      channel: this.audioResource.metadata.channel,
      tracks: [currentTrack],
      stream: { seek: time },
    });
    return true;
  }

  /**
   * Inserts a track at a specific index. Will move track and current index and following after the inserted track.
   * If index is smaller or grater than queue size, will insert at the start/end at the queue accordingly.
   * Will not play the track if queue is empty and currently not playing.
   */
  insert(track: Track, index: number): void {
    if (index < 0) this.queue.unshift(track);
    else if (index >= this.queue.length) this.queue.push(track);
    else this.queue.splice(index, 0, track);
  }

  /**
   * Removes the queued track at the specific index, if any.
   *
   * @returns Removed track or `undefined` if index is invalid.
   */
  remove(index: number): Track | undefined {
    if (index < 0 || index >= this.queue.length) return;
    const removedTracks = this.queue.splice(index, 1);
    if (removedTracks.length) return removedTracks[0];
  }

  /** Sets the repeat mode. */
  setRepeat(mode: PlayerRepeatMode): void {
    this.repeatMode = mode;
  }

  /** Gets the current repeat mode. */
  getRepeat(): PlayerRepeatMode {
    return this.repeatMode;
  }
}
