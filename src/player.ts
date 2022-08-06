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
  PlayerError,
  PlayerErrorCode,
  PlayerEvents,
  PlayerOptions,
  PlayerRepeatMode,
  PlayOptions,
} from "./types/player";
import { validateVolume } from "./utils/player";

interface AudioPlayerMetadata {
  channel: VoiceBasedChannel;
  track: Track;
}

export class Player extends TypedEmitter<PlayerEvents> {
  private readonly audioPlayer = createAudioPlayer();
  private queue: Track[] = [];
  private volume: number | undefined;
  private audioResource: AudioResource<AudioPlayerMetadata> | undefined;
  private repeatMode = PlayerRepeatMode.NONE;

  constructor(
    public readonly guildId: string,
    public readonly options: PlayerOptions = {}
  ) {
    super();

    this.audioPlayer.on("stateChange", async (oldState, newState) => {
      // the following player events are based on discord voice life cycle, see: https://discordjs.guide/voice/audio-player.html#life-cycle
      const oldTrack =
        oldState.status !== AudioPlayerStatus.Idle
          ? (oldState.resource as NonNullable<typeof this.audioResource>)
              .metadata.track
          : undefined;
      const newTrack =
        newState.status !== AudioPlayerStatus.Idle
          ? (newState.resource as NonNullable<typeof this.audioResource>)
              .metadata.track
          : undefined;

      // check if new track has started (will also be emitted when current track has been seeked)
      if (
        newState.status === AudioPlayerStatus.Playing &&
        oldState.status === AudioPlayerStatus.Buffering &&
        newTrack
      ) {
        this.emit("trackStart", { ...newTrack });
      }

      // console.log(oldState.status, newState.status);

      // check if track has ended (will NOT be emitted when player was destroyed while playing)
      const playingTrackEnded =
        oldState.status === AudioPlayerStatus.Playing &&
        ![AudioPlayerStatus.Paused, AudioPlayerStatus.AutoPaused].includes(
          newState.status
        );
      const pausedTrackEnded =
        oldState.status === AudioPlayerStatus.Paused &&
        newState.status === AudioPlayerStatus.Buffering;

      if (oldTrack && (playingTrackEnded || pausedTrackEnded)) {
        this.emit("trackEnd", oldTrack);
      }

      // when track ends, play next queued track if available
      if (
        oldState.status !== AudioPlayerStatus.Idle &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        const nextTrack = await this.getNextTrack();

        if (nextTrack) {
          const voiceChannel = (
            oldState.resource as AudioResource<AudioPlayerMetadata>
          ).metadata.channel;

          await this.play({
            channel: voiceChannel,
            tracks: [nextTrack],
          });
        }

        if (!nextTrack && (this.options.stopOnEnd ?? true)) {
          this.stop();
        }
      }
    });
  }

  /** Gets the next track, Considers the current repeat mode. */
  private async getNextTrack(): Promise<Track | undefined> {
    // this method is async to support autoplay and queue repeat in the future
    if (this.repeatMode === PlayerRepeatMode.TRACK) {
      const currentTrack = this.getCurrentTrack();
      if (currentTrack) {
        delete currentTrack.seek;
        return currentTrack;
      }
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
        const error = new PlayerError(
          PlayerErrorCode.REFUSED_TO_SWITCH_VOICE_CHANNEL,
          `Refused to join voice channel ${channel.id} because player is already connected to voice channel ${currentConnection.joinConfig.channelId}`
        );
        this.emit("error", error);
        throw error;
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
      const error = new PlayerError(
        PlayerErrorCode.UNKNOWN_PLAYER_ENGINE,
        `Unknown player engine "${track.source}"`
      );
      this.emit("error", error);
      throw error;
    }

    const trackStream = await playerEngine.getStream(track, this.options);

    if (!trackStream) {
      const error = new PlayerError(
        PlayerErrorCode.UNKNOWN_PLAYER_ENGINE,
        `Unable to create stream for track (url: ${track.url})`
      );
      this.emit("error", error);
      throw error;
    }

    let skippedTrack: Track | undefined;

    if (options.addSkippedTrackToQueue) {
      const track = this.getCurrentTrack();
      if (track) {
        track.seek = this.getPlaybackDuration();
        skippedTrack = track;
      }
    }

    // get (initial) player volume
    let volume: number;

    if (this.volume != null) {
      volume = this.volume;
    } else {
      if (typeof this.options.initialVolume === "function") {
        try {
          volume = await this.options.initialVolume(options.channel.guildId);
        } catch (e) {
          volume = 100;

          const error = new PlayerError(
            PlayerErrorCode.INITIAL_VOLUME_FUNCTION_ERROR,
            `Unexpected error for custom initial volume function: ${
              (e as Error).message
            }`
          );
          this.emit("error", error);
        }
      } else {
        volume = this.options.initialVolume ?? 100;
      }
    }

    this.audioResource = createAudioResource(trackStream.stream, {
      inputType: trackStream.type,
      inlineVolume,
      metadata,
    });

    this.setVolume(volume);

    this.join(options.channel);
    this.audioPlayer.play(this.audioResource);

    // add the rest of the tracks to the start of the queue
    this.queue.unshift(...options.tracks.slice(1));
    if (skippedTrack) this.queue.unshift(skippedTrack);
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
    if (stopped) this.audioResource = undefined;
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
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }

  /**
   * Gets the currently playing track, if any.
   */
  getCurrentTrack(): Track | undefined {
    if (!this.audioResource) return;
    return Object.assign({}, this.audioResource.metadata.track);
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
   * Sets the player volume for all tracks. Requires `inlineVolume` in player options to be `true` (default).
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
    this.clear();
    const connection = getVoiceConnection(this.guildId);
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
    if (!currentTrack || !this.audioResource) return false;
    if (time / 1000 >= currentTrack.duration) return !!this.skip();

    currentTrack.seek = time > 0 ? time : 0;

    await this.play({
      channel: this.audioResource.metadata.channel,
      tracks: [currentTrack],
    });
    return true;
  }

  /**
   * Inserts a track at a specific index. Will move current index and following after the inserted track.
   * If index is negative or grater than queue size, will insert at the start/end at the queue accordingly.
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

  /** Gets the voice channel that the player is currently connected to (if any). */
  getVoiceChannel(): VoiceBasedChannel | undefined {
    return this.audioResource?.metadata.channel;
  }
}
