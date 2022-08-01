import playdl, { YouTubeVideo } from "play-dl";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines";

const responsibleRegex =
  /^https?:\/\/((www\.|music\.)?youtube\.com|youtu\.be)\//;

/**
 * Player engine to search/stream tracks from YouTube.
 */
export const youtubeEngine: PlayerEngine = {
  source: "youtube",
  isResponsible(query) {
    return responsibleRegex.test(query);
  },
  async search(query, _, searchOptions) {
    if (isPlaylist(query))
      return await searchPlaylist(query, searchOptions?.limit);

    const videos = await playdl.search(query, {
      source: { youtube: "video" },
      limit: searchOptions?.limit,
    });

    return [
      {
        tracks: videos.map((video) => mapYouTubeVideo(video)),
        source: this.source,
      },
    ];
  },
  async getStream(track, playerOptions) {
    return await playdl.stream(track.url, {
      quality:
        playerOptions.quality === "low"
          ? 0
          : playerOptions.quality === "medium"
          ? 1
          : 2,
      seek: track?.seek ? track.seek / 1000 : undefined,
    });
  },
};

function isPlaylist(query: string) {
  return (
    youtubeEngine.isResponsible(query, {}) &&
    (query.includes("/playlist") || query.includes("&list="))
  );
}

async function searchPlaylist(
  query: string,
  limit?: number
): Promise<SearchResult[]> {
  const playlist = await playdl.playlist_info(query);
  let playlistVideos: YouTubeVideo[] = playlist.page(1);

  // limit/fetch more videos (playlist will only include first 100 songs by default)
  if (!limit || limit < 0) {
    playlistVideos = await playlist.all_videos();
  } else if (limit <= 100) {
    playlistVideos = playlistVideos.slice(0, limit);
  } else {
    const remainingVideos = await playlist.next(limit - 100);
    playlistVideos = playlistVideos.concat(remainingVideos);
  }

  const playlistInfo: Playlist | undefined = playlist.url
    ? {
        title: playlist.title ?? "",
        url: playlist.url ?? "",
        thumbnailUrl: playlist.thumbnail?.url,
      }
    : undefined;

  return [
    {
      tracks: playlistVideos.map((video) => {
        return {
          ...mapYouTubeVideo(video),
          playlist: playlistInfo,
        };
      }),
      playlist: playlistInfo,
      source: youtubeEngine.source,
    },
  ];
}

function mapYouTubeVideo(video: YouTubeVideo): Track {
  return {
    title: video.title ?? "",
    url: video.url,
    thumbnailUrl: video.thumbnails[0].url ?? "",
    duration: video.durationInSec,
    artist: video.channel?.name,
    source: youtubeEngine.source,
  };
}
