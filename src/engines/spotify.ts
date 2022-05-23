import { getTracks, Tracks } from "spotify-url-info";
import { PlayerEngine, Track } from "../types/engines";
import { youtubeEngine } from "./youtube";

/**
 * Player engine to search/stream tracks from Spotify.
 * Spotify does not provide a web api to stream tracks so the track will be streamed from YouTube instead.
 */
export const spotifyEngine: PlayerEngine = {
  search: async (query, options) => {
    // TODO: check how to get playlist info
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
      { limit: 1 }
    );

    if (!searchResults.length || !searchResults[0].tracks.length) return null;
    const mappedTrack = searchResults[0].tracks[0];

    return youtubeEngine.getStream(mappedTrack, playerOptions, streamOptions);
  },
};

function mapSpotifyTrack(track: Tracks): Track {
  return {
    title: track.name,
    url: track.external_urls.spotify,
    thumbnailUrl: "",
    duration: Math.round(track.duration_ms / 1000),
    artist: track.artists?.map((a) => a.name).join(", "),
    source: "spotify",
  };
}
