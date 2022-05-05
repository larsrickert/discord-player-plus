import playdl, { YouTubeVideo } from "play-dl";
import { SearchResult } from "../types/player";
import { SearchType, Track } from "../types/tracks";

export async function search(
  query: string,
  type: SearchType
): Promise<SearchResult> {
  const resolvedType =
    type === SearchType.AUTO ? detectSearchType(query) : type;

  return await searchYoutube(
    query,
    resolvedType === SearchType.YOUTUBE_PLAYLIST
  );
}

function detectSearchType(query: string): Exclude<SearchType, SearchType.AUTO> {
  // TODO: implement AUTO mode
  return SearchType.YOUTUBE_TRACKS;
}

async function searchYoutube(
  query: string,
  isPlaylist = false
): Promise<SearchResult> {
  let tracks: Track[] = [];

  // TODO: refactor SearchResult interface
  if (isPlaylist) {
    const playlists = await playdl.search(query, {
      source: { youtube: "playlist" },
    });
    for (const playlist of playlists) {
      const playlistVideos = await playlist.all_videos();
      tracks.push(
        ...playlistVideos.map((video) => {
          return {
            ...mapYouTubeVideo(video),
            playlist: playlist.url
              ? {
                  title: playlist.title ?? "",
                  url: playlist.url ?? "",
                  thumbnailUrl: playlist.thumbnail?.url,
                }
              : undefined,
          };
        })
      );
    }
  } else {
    const videos = await playdl.search(query);
    tracks = videos.map((video) => mapYouTubeVideo(video));
  }

  return { tracks };
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
