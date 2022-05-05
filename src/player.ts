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
import { stream } from "play-dl";
import { TypedEmitter } from "tiny-typed-emitter";
import {
  AudioPlayerMetadata,
  PlayerEvents,
  PlayerOptions,
  PlayOptions,
  SearchOptions,
  SearchResult,
  StreamOptions,
  TrackStream,
} from "./types/player";
import { SearchType, Track } from "./types/tracks";
import { shuffle, validateVolume } from "./utils/player";
import { search } from "./utils/search";

export class Player extends TypedEmitter<PlayerEvents> {
  private readonly audioPlayer = createAudioPlayer();
  private queue: Track[] = [];
  private volume = 100;
  private audioResource: AudioResource<AudioPlayerMetadata> | undefined;

  constructor(
    public readonly guildId: string,
    private readonly options: PlayerOptions = {}
  ) {
    super();

    if (options.initialVolume && validateVolume(options.initialVolume)) {
      this.volume = options.initialVolume;
    }

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
          const nextTrack = this.queue.shift();

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

  private join(channel: VoiceBasedChannel): VoiceConnection {
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

  /**
   * Immediate plays the first of the given tracks, skips current track if playing.
   * The remaining tracks will be added to the front of the queue.
   * If no tracks provided, will play first queued track if available.
   */
  async play(options: PlayOptions): Promise<void> {
    const track: Track | undefined = options.tracks.length
      ? options.tracks[0]
      : this.queue[0];
    if (!track) return;

    const inlineVolume = this.options.inlineVolume ?? true;
    const metadata: AudioPlayerMetadata = {
      channel: options.channel,
      track: track,
    };

    if (track.source === "file") {
      // play local file
      this.audioResource = createAudioResource(track.url, {
        inlineVolume,
        metadata,
      });
    } else {
      // play remote file
      const trackStream = await this.getTrackStream(track, options.stream);

      this.audioResource = createAudioResource(trackStream.stream, {
        inputType: trackStream.type,
        inlineVolume,
        metadata,
      });
    }

    this.audioResource.volume?.setVolume(this.volume / 100);
    this.join(options.channel);
    this.audioPlayer.play(this.audioResource);

    // add the rest of the tracks to the start of the queue
    this.queue.unshift(...options.tracks.slice(1));
  }

  private async getTrackStream(
    track: Track,
    options?: StreamOptions
  ): Promise<TrackStream> {
    if (this.options.customStream) {
      const stream = await this.options.customStream(track, options);
      if (stream) return stream;
    }

    const qualityOption = this.options.quality;

    return await stream(track.url, {
      quality: qualityOption === "low" ? 0 : qualityOption === "medium" ? 1 : 2,
      seek: options?.seek ? options?.seek / 1000 : undefined,
    });
  }

  /**
   * Adds the given tracks to the end of the queue. Immediately plays first track in queue if currently not playing.
   */
  async add(options: PlayOptions): Promise<void> {
    this.queue.push(...options.tracks);

    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
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
   */
  setPause(shouldPause: boolean): boolean {
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

  /**
   * Searches tracks for the given query on YouTube. Supports search of Spotify, Deezer and Soundcloud tracks.
   *
   * @returns Search result.
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    if (this.options.customSearch) {
      const customResult = await this.options.customSearch(query, options);
      if (customResult) return customResult;
    }

    return await search(query, options?.type ?? SearchType.AUTO);
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
}
