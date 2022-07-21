import fetch from "isomorphic-unfetch";
import spotify, { Tracks } from "spotify-url-info";
import { PlayerEngine, SearchResult, Track } from "../types/engines";
import { youtubeEngine } from "./youtube";

const { getTracks, getData } = spotify(fetch);

/**
 * Player engine to search/stream tracks from Spotify.
 * Spotify does not provide a web api to stream tracks so the track will be streamed from YouTube instead.
 */
export const spotifyEngine: PlayerEngine = {
  source: "spotify",
  async isResponsible(query) {
    return query.startsWith("https://open.spotify.com");
  },
  async search(query) {
    const isPlaylist = query.startsWith("https://open.spotify.com/playlist");
    if (isPlaylist) return await searchPlaylist(query);

    const tracks = await getTracks(query);

    return [
      {
        tracks: tracks.map((track) => mapSpotifyTrack(track)),
        source: this.source,
      },
    ];
  },
  async getStream(track, playerOptions) {
    const searchResults = await youtubeEngine.search(
      track.artist ? `${track.title} ${track.artist}` : track.title,
      playerOptions,
      { limit: 1 }
    );

    if (!searchResults.length || !searchResults[0].tracks.length) return null;
    const mappedTrack = searchResults[0].tracks[0];
    mappedTrack.seek = track.seek;

    return youtubeEngine.getStream(mappedTrack, playerOptions);
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
      source: spotifyEngine.source,
    },
  ];
}

function mapSpotifyTrack(track: Tracks): Track {
  return {
    title: track.name,
    url: track.external_urls.spotify,
    duration: Math.round(track.duration_ms / 1000),
    artist: track.artists?.map((a) => a.name).join(", "),
    source: spotifyEngine.source,
  };
}
