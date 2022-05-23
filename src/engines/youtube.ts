import playdl, { YouTubeVideo } from "play-dl";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines";

export const youtubeEngine: PlayerEngine = {
  search: async (query, isPlaylist) => {
    const results: SearchResult[] = [];

    if (isPlaylist) {
      return await searchPlaylist(query);
    } else {
      const videos = await playdl.search(query, {
        source: { youtube: "video" },
      });
      results.push({
        tracks: videos.map((video) => mapYouTubeVideo(video)),
        source: "youtube",
      });
    }

    return results;
  },
  getStream: async (track, playerOptions, streamOptions) => {
    return await playdl.stream(track.url, {
      quality:
        playerOptions.quality === "low"
          ? 0
          : playerOptions.quality === "medium"
          ? 1
          : 2,
      seek: streamOptions?.seek ? streamOptions?.seek / 1000 : undefined,
    });
  },
};

async function searchPlaylist(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  const playlists = await playdl.search(query, {
    source: { youtube: "playlist" },
  });

  for (const playlist of playlists) {
    const playlistVideos = await playlist.all_videos();
    const playlistInfo: Playlist | undefined = playlist.url
      ? {
          title: playlist.title ?? "",
          url: playlist.url ?? "",
          thumbnailUrl: playlist.thumbnail?.url,
        }
      : undefined;

    results.push({
      tracks: playlistVideos.map((video) => {
        return {
          ...mapYouTubeVideo(video),
          playlist: playlistInfo,
        };
      }),
      playlist: playlistInfo,
      source: "youtube",
    });
  }

  return results;
}

function mapYouTubeVideo(video: YouTubeVideo): Track {
  return {
    title: video.title ?? "",
    url: video.url,
    thumbnailUrl: video.thumbnails[0].url ?? "",
    duration: video.durationInSec,
    artist: video.channel?.name,
    source: "youtube",
  };
}
