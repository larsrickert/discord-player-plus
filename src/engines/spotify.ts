import { getData, getTracks, Tracks } from "spotify-url-info";
import { PlayerEngine, SearchResult, Track } from "../types/engines";
import { youtubeEngine } from "./youtube";

/**
 * Player engine to search/stream tracks from Spotify.
 * Spotify does not provide a web api to stream tracks so the track will be streamed from YouTube instead.
 */
export const spotifyEngine: PlayerEngine = {
  search: async (query) => {
    const isPlaylist = query.startsWith("https://open.spotify.com/playlist");
    if (isPlaylist) return await searchPlaylist(query);

    const tracks = await getTracks(query);

    return [
      {
        tracks: tracks.map((track) => mapSpotifyTrack(track)),
        source: "spotify",
      },
    ];
  },
  getStream: async (track, playerOptions, streamOptions) => {
    const searchResults = await youtubeEngine.search(
      `${track.title} ${track.artist}`,
      playerOptions,
      { limit: 1 }
    );

    if (!searchResults.length || !searchResults[0].tracks.length) return null;
    const mappedTrack = searchResults[0].tracks[0];

    return youtubeEngine.getStream(mappedTrack, playerOptions, streamOptions);
  },
};

async function searchPlaylist(query: string): Promise<SearchResult[]> {
  const data = await getData(query);
  if (data?.type !== "playlist") return [];

  return [
    {
      tracks: data.tracks.items.map((i: { track: Tracks }) =>
        mapSpotifyTrack(i.track)
      ),
      playlist: {
        title: data.name,
        url: data.external_urls.spotify,
        thumbnailUrl: data.images.length ? data.images[0].url : undefined,
      },
      source: "spotify",
    },
  ];
}

function mapSpotifyTrack(track: Tracks): Track {
  return {
    title: track.name,
    url: track.external_urls.spotify,
    duration: Math.round(track.duration_ms / 1000),
    artist: track.artists?.map((a) => a.name).join(", "),
    source: "spotify",
  };
}
