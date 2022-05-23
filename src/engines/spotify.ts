import { getTracks, Tracks } from "spotify-url-info";
import { PlayerEngine, SearchResult, Track } from "../types/engines";
import { youtubeEngine } from "./youtube";

export const spotifyEngine: PlayerEngine = {
  search: async (query, isPlaylist) => {
    const results: SearchResult[] = [];

    // TODO: check how to get playlist info
    const tracks = await getTracks(query);

    results.push({
      tracks: tracks.map((track) => mapSpotifyTrack(track)),
      source: "spotify",
    });

    return results;
  },
  getStream: async (track, playerOptions, streamOptions) => {
    // TODO: add limit 1
    const searchResults = await youtubeEngine.search(
      `${track.title} ${track.artist}`
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
