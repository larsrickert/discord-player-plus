import { StreamType } from "@discordjs/voice";
import {
  PlaylistInfo,
  Quality,
  SearchType,
  VideoSummary,
  Ytdl,
  parsePlaylistId,
  parseVideoId,
} from "@distube/ytdl-core";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines.js";

const responsibleRegex = /^https?:\/\/((www\.|music\.)?youtube\.com|youtu\.be)\//;

const ytdl = new Ytdl();

/**
 * Player engine to search/stream tracks from YouTube.
 */
export const youtubeEngine = {
  source: "youtube",
  isResponsible(query) {
    return responsibleRegex.test(query);
  },
  async search(query, _, searchOptions) {
    query = query.trim();
    if (!query) return null;

    if (parsePlaylistId(query)) {
      return await searchPlaylist(query, searchOptions?.limit);
    }

    const videoId = parseVideoId(query);
    if (videoId) {
      const { videoDetails } = await ytdl.getInfo(videoId);
      return {
        tracks: [mapVideoToTrack(videoDetails)],
        source: this.source,
      };
    }

    const videos = await ytdl.search(query, {
      type: SearchType.Video,
      limit: searchOptions?.limit,
    });

    return {
      tracks: videos.map((video) => mapVideoToTrack(video)),
      source: this.source,
    };
  },
  async getStream(track, playerOptions) {
    const stream = ytdl.download(track.url, {
      quality: playerOptions.quality === "low" ? Quality.LowestAudio : Quality.HighestAudio,
      filter: { hasAudio: true, hasVideo: false },
      startTimeMs: track.seek,
    });

    return { stream, type: StreamType.Arbitrary };
  },
} as const satisfies PlayerEngine;

const searchPlaylist = async (query: string, limit?: number): Promise<SearchResult> => {
  const playlistInfo: PlaylistInfo = await ytdl.getPlaylist(query, {
    limit: limit && limit > 0 ? limit : undefined,
  });

  const playlist: Playlist | undefined = playlistInfo.url
    ? {
        title: playlistInfo.title ?? "",
        url: playlistInfo.url,
        thumbnailUrl: playlistInfo.thumbnails.at(-1)?.url,
      }
    : undefined;

  return {
    tracks: playlistInfo.videos.map<Track>((video) =>
      Object.assign(mapVideoToTrack(video), { playlist }),
    ),
    playlist,
    source: youtubeEngine.source,
  };
};

const mapVideoToTrack = (
  video: Pick<VideoSummary, "title" | "url" | "thumbnails" | "lengthSeconds"> & {
    author: Pick<VideoSummary["author"], "name">;
  },
): Track => {
  return {
    title: video.title,
    url: video.url,
    thumbnailUrl: video.thumbnails.at(-1)?.url,
    duration: video.lengthSeconds ?? 0,
    artist: video.author.name,
    source: youtubeEngine.source,
  };
};
