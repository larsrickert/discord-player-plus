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
export const spotifyEngine: PlayerEngine = {
  source: "spotify",
  isResponsible(query) {
    return responsibleRegex.test(query);
  },
  async search(query, _, searchOptions) {
    const isPlaylist = query.includes("open.spotify.com/playlist");
    if (isPlaylist) return await searchPlaylist(query, searchOptions?.limit);

    const tracks = await getTracks(query);

    return {
      tracks: tracks.map((track) => mapSpotifyTrack(track, query)),
      source: this.source,
    };
  },
  async getStream(track, playerOptions) {
    const searchResult = await youtubeEngine.search(
      track.artist ? `${track.title} ${track.artist}` : track.title,
      playerOptions,
      { limit: 1 },
    );
    if (!searchResult?.tracks.length) return null;

    const mappedTrack = searchResult.tracks[0];
    mappedTrack.seek = track.seek;

    return youtubeEngine.getStream(mappedTrack, playerOptions);
  },
} as const;

async function searchPlaylist(
  query: string,
  limit?: number,
): Promise<SearchResult | null> {
  const data = await getData<SpotifyPlaylist | undefined>(query);
  if (data?.type !== "playlist") return null;

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

  return { tracks, playlist, source: spotifyEngine.source };
}

/**
 * Maps the given spotify track.
 * @param url Can be passed to set url. If unset, track uri will be used.
 */
function mapSpotifyTrack(track: Tracks, url?: string): Track {
  return {
    title: track.name,
    url: url || track.uri,
    duration: Math.round((track.duration ?? 0) / 1000),
    artist: track.artist,
    source: spotifyEngine.source,
  };
}

export interface SpotifyPlaylist {
  type: "playlist";
  name: string;
  uri: string;
  id: string;
  title: string;
  subtitle: string;
  trackList: {
    uri: string;
    uid: string;
    title: string;
    subtitle: string;
    /** Duration in milliseconds */
    duration: number;
  }[];
  coverArt?: {
    sources?: { url: string }[];
  };
}
