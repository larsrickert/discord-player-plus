import {
  PlayerEngine,
  SearchType,
  SearchTypeInfo,
  TrackSource,
} from "../types/engines";
import { fileEngine } from "./file";
import { spotifyEngine } from "./spotify";
import { youtubeEngine } from "./youtube";

export const playerEngines: Record<TrackSource, PlayerEngine> = {
  youtube: youtubeEngine,
  file: fileEngine,
  spotify: spotifyEngine,
};

const searchTypeInfos: Record<
  Exclude<SearchType, SearchType.AUTO>,
  SearchTypeInfo
> = {
  [SearchType.YOUTUBE_TRACKS]: {
    type: SearchType.YOUTUBE_TRACKS,
    isPlaylist: false,
    source: "youtube",
  },
  [SearchType.YOUTUBE_PLAYLIST]: {
    type: SearchType.SPOTIFY_PLAYLIST,
    isPlaylist: true,
    source: "spotify",
  },
  [SearchType.SPOTIFY_TRACKS]: {
    type: SearchType.SPOTIFY_TRACKS,
    isPlaylist: false,
    source: "spotify",
  },
  [SearchType.SPOTIFY_PLAYLIST]: {
    type: SearchType.SPOTIFY_PLAYLIST,
    isPlaylist: true,
    source: "spotify",
  },
};

export function getSearchTypeInfo(
  query: string,
  searchType?: SearchType
): SearchTypeInfo {
  if (searchType == null || searchType === SearchType.AUTO) {
    searchType = detectSearchType(query);
  }

  return searchTypeInfos[searchType];
}

/**
 * Automatically detect the query type
 */
function detectSearchType(query: string): Exclude<SearchType, SearchType.AUTO> {
  if (query.startsWith("https://open.spotify.com/track")) {
    return SearchType.SPOTIFY_TRACKS;
  }
  if (query.startsWith("https://open.spotify.com/playlist")) {
    return SearchType.SPOTIFY_PLAYLIST;
  }
  if (query.startsWith("https://www.youtube.com") && query.includes("list=")) {
    return SearchType.YOUTUBE_PLAYLIST;
  }
  return SearchType.YOUTUBE_TRACKS;
}
