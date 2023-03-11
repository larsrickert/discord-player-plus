import fetch from "isomorphic-unfetch";
import spotify, { Tracks } from "spotify-url-info";
import { PlayerEngine, Playlist, SearchResult, Track } from "../types/engines";
import { youtubeEngine } from "./youtube";

const { getTracks, getData } = spotify(fetch);

const responsibleRegex = /^https?:\/\/open.spotify.com\//;

/**
 * Player engine to search/stream tracks from Spotify.
 * Spotify does not provide a web api to stream tracks so the track will be streamed from YouTube instead.
 */
export const spotifyEngine = {
  source: "spotify",
  isResponsible(query) {
    return responsibleRegex.test(query);
  },
  async search(query, _, searchOptions) {
    const isPlaylist = query.includes("open.spotify.com/playlist");
    if (isPlaylist) return await searchPlaylist(query, searchOptions?.limit);

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
} as const satisfies PlayerEngine;

async function searchPlaylist(
  query: string,
  limit?: number
): Promise<SearchResult[]> {
  const data: SpotifyPlaylist | undefined = await getData(query);
  if (data?.type !== "playlist") return [];

  const playlist: Playlist = {
    title: data.name,
    url: query,
    thumbnailUrl: data.coverArt?.sources?.[0]?.url,
  };

  let tracks: Track[] = data.trackList.map((i) => {
    return {
      title: i.title,
      url: i.uri,
      duration: Math.round(i.duration / 1000),
      artist: i.subtitle,
      source: spotifyEngine.source,
      playlist,
    };
  });

  if (limit && tracks.length > limit) {
    tracks = tracks.slice(0, limit);
  }

  return [{ tracks, playlist, source: spotifyEngine.source }];
}

function mapSpotifyTrack(track: Tracks): Track {
  // somehow for some tracks "spotify-url-info" returns "duration" instead of "duration_ms"
  // check issue https://github.com/microlinkhq/spotify-url-info/issues/107 for further information/fixes.
  const durationMs =
    track.duration_ms ||
    (track as Tracks & { duration?: number }).duration ||
    0;

  return {
    title: track.name,
    url: track.external_urls.spotify,
    duration: Math.round(durationMs / 1000),
    artist: track.artists?.map((a) => a.name).join(", "),
    source: spotifyEngine.source,
  };
}

export interface SpotifyPlaylist {
  type: "playlist";
  name: string;
  uri: string;
  id: string;
  title: string;
  trackList: {
    uri: string;
    uid: string;
    title: string;
    subtitle: string;
    duration: number;
  }[];
  coverArt?: {
    sources?: { url: string }[];
  };
}
