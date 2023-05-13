import playDl, { YouTubeVideo } from "play-dl";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines";

const responsibleRegex =
  /^https?:\/\/((www\.|music\.)?youtube\.com|youtu\.be)\//;

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

    if (playDl.yt_validate(query) === "playlist") {
      return await searchPlaylist(query, searchOptions?.limit);
    }

    const videos = await playDl.search(query, {
      source: { youtube: "video" },
      limit: searchOptions?.limit,
    });

    return {
      tracks: videos.map((video) => mapVideoToTrack(video)),
      source: this.source,
    };
  },
  async getStream(track, playerOptions) {
    return await playDl.stream(track.url, {
      quality:
        playerOptions.quality === "low"
          ? 0
          : playerOptions.quality === "medium"
          ? 1
          : 2,
      seek: track?.seek ? track.seek / 1000 : undefined,
    });
  },
} as const satisfies PlayerEngine;

const searchPlaylist = async (
  query: string,
  limit?: number
): Promise<SearchResult> => {
  const playlistInfo = await playDl.playlist_info(query, { incomplete: true });
  let playlistVideos: YouTubeVideo[] = playlistInfo.page(1);

  // limit/fetch more videos (playlist will only include first 100 songs by default)
  if (!limit || limit < 0) {
    playlistVideos = await playlistInfo.all_videos();
  } else if (limit <= 100) {
    playlistVideos = playlistVideos.slice(0, limit);
  } else {
    const remainingVideos = await playlistInfo.next(limit - 100);
    playlistVideos = playlistVideos.concat(remainingVideos);
  }

  const playlist: Playlist | undefined = playlistInfo.url
    ? {
        title: playlistInfo.title ?? "",
        url: playlistInfo.url ?? "",
        thumbnailUrl: playlistInfo.thumbnail?.url,
      }
    : undefined;

  return {
    tracks: playlistVideos.map<Track>((video) => ({
      ...mapVideoToTrack(video),
      playlist,
    })),
    playlist,
    source: youtubeEngine.source,
  };
};

const mapVideoToTrack = (video: YouTubeVideo): Track => {
  return {
    title: video.title ?? "",
    url: video.url,
    thumbnailUrl: video.thumbnails[0]?.url,
    duration: video.durationInSec,
    artist: video.channel?.name,
    source: youtubeEngine.source,
  };
};
