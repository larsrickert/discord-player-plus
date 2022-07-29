import playdl, { YouTubeVideo } from "play-dl";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines";

/**
 * Player engine to search/stream tracks from YouTube.
 */
export const youtubeEngine: PlayerEngine = {
  source: "youtube",
  async isResponsible(query) {
    return query.startsWith("https://www.youtube.com");
  },
  async search(query, _, searchOptions) {
    const isPlaylist =
      query.startsWith("https://www.youtube.com/playlist") ||
      (query.startsWith("https://www.youtube.com/watch") &&
        query.includes("list="));

    if (isPlaylist) {
      return await searchPlaylist(query);
    }

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

async function searchPlaylist(query: string): Promise<SearchResult[]> {
  const playlist = await playdl.playlist_info(query);
  const playlistVideos = await playlist.all_videos();

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
