import {
  AudioPlayerState,
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
import { search, stream } from "play-dl";
import { TypedEmitter } from "tiny-typed-emitter";
import {
  PlayerEvents,
  PlayerOptions,
  PlayOptions,
  SearchOptions,
  SearchResult,
  StreamOptions,
  TrackStream,
} from "../types/player";
import { Track } from "../types/tracks";
import { shuffle, validateVolume } from "../utils/player";

export class Player extends TypedEmitter<PlayerEvents> {
  private readonly audioPlayer = createAudioPlayer();
  private queue: Track[] = [];
  private volume = 100;
  private audioResource:
    | AudioResource<{ channel: VoiceBasedChannel; track: Track }>
    | undefined;

  constructor(
    public readonly guildId: string,
    private readonly options: PlayerOptions = {}
  ) {
    super();

    if (options.initialVolume && validateVolume(options.initialVolume)) {
      this.volume = options.initialVolume;
    }

    this.audioPlayer.on(
      "stateChange" as any,
      async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
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

          this.emit("trackEnd");
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

    const subscription = connection.subscribe(this.audioPlayer);

    connection.removeAllListeners();

    const disconnect = () => {
      this.audioPlayer.stop();
      subscription?.unsubscribe();
      this.emit("disconnect");
    };

    connection
      .on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          disconnect();
        }
      })
      .on(VoiceConnectionStatus.Destroyed, () => disconnect());

    return connection;
  }

  /**
   * Immediate plays the given track, skips current track if playing.
   * If not tracks provided, will play first queued track if available.
   */
  async play(options: PlayOptions): Promise<void> {
    const track: Track | undefined = options.tracks.length
      ? options.tracks[0]
      : this.queue[0];
    if (!track) return;

    const inlineVolume = this.options.inlineVolume ?? true;

    if (track.source === "file") {
      // play local file
      this.audioResource = createAudioResource(track.url, {
        inlineVolume,
        metadata: {
          channel: options.channel,
          track: track,
        },
      });
    } else {
      // play remote file
      const trackStream = await this.getTrackStream(track, options.stream);

      this.audioResource = createAudioResource(trackStream.stream, {
        inputType: trackStream.type,
        inlineVolume,
        metadata: {
          channel: options.channel,
          track: track,
        },
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
   * Adds the given track to the end of the queue. Immediately plays first track in queue if currently not playing.
   */
  async add(options: PlayOptions): Promise<void> {
    this.queue.push(...options.tracks);

    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
      await this.play({ ...options, tracks: [] });
    }
  }

  /**
   * Clears queue. Does not stop current track.
   * @returns Number of cleared tracks.
   */
  clear(): number {
    const length = this.queue.length;
    this.queue = [];
    return length;
  }

  /**
   * Skips the current track if playing.
   * @returns Skipped track, if any.
   */
  skip(): Track | undefined {
    const currentTrack = this.getCurrentTrack();
    this.audioPlayer.stop();
    return currentTrack;
  }

  /**
   * Pauses or resumes current track.
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
   * @returns Copy of the current queue.
   */
  getQueue(): Track[] {
    return this.queue.slice();
  }

  /**
   * Sets the player volume for all tracks.
   * @param volume Volume between 0 and 200.
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
    connection?.destroy();
  }

  /**
   * Gets the playback duration (already played time) of the current track in milliseconds.
   */
  getPlaybackDuration(): number {
    return this.audioResource?.playbackDuration ?? 0;
  }

  /**
   * Searches tracks for the given query.
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    if (this.options.customSearch) {
      const customResult = await this.options.customSearch(query, options);
      if (customResult) return customResult;
    }

    const result: SearchResult = { tracks: [] };

    const videos = await search(query, { source: { youtube: "video" } });
    result.tracks = videos.map((video) => {
      return {
        title: video.title ?? "",
        url: video.url,
        thumbnailUrl: video.thumbnails[0].url ?? "",
        source: "youtube",
      };
    });

    return result;
  }
}
