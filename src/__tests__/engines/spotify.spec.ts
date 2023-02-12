import { Readable } from "stream";
import { afterEach, describe, expect, it, test, vi } from "vitest";
import { spotifyEngine } from "../../engines/spotify";
import { youtubeEngine } from "../../engines/youtube";
import { Playlist, Track } from "../../types/engines";

describe("spotify engine", () => {
  const expectedTrack: Track = {
    url: "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb",
    title: "Despacito",
    duration: 229,
    source: "spotify",
    artist: "Luis Fonsi, Daddy Yankee",
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.concurrent.each([
    "https://open.spotify.com/",
    "http://open.spotify.com/",
  ])("is responsible for %s", (query) => {
    const isResponsible = spotifyEngine.isResponsible(query, {});
    expect(isResponsible).toBe(true);
  });

  test.concurrent.each([
    "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb?si=a956465f4cc848cc",
    "https://open.spotify.com/embed/track/6habFhsOp2NvshLv26DqMb",
  ])("searches track %s", async (query) => {
    const searchResults = await spotifyEngine.search(query, {}, {});
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBeGreaterThanOrEqual(1);
    expect(result.source).toBe("spotify");
    expect(result.playlist).toBeUndefined();
    const track = result.tracks[0];
    delete track.thumbnailUrl;
    // do not test thumbnail url since it can change due to caching
    expect(track).toEqual(expectedTrack);
  });

  it.concurrent("searches playlist", async () => {
    const query = "https://open.spotify.com/playlist/3xMQTDLOIGvj3lWH5e5x6F";

    const searchResults = await spotifyEngine.search(query, {}, {});
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBeGreaterThanOrEqual(1);
    expect(result.source).toBe("spotify");
    expect(result.playlist).toBeDefined();
    expect(result.tracks.length).toBe(100);

    const expected: Playlist = {
      title:
        "Charts 2023 🔥Top 100 Aktuelle Charts Radio Hits 2023 - Musik Mix - Summer - Pop Songs - Top 2022",
      url: query,
    };

    delete result.playlist?.thumbnailUrl;

    // do not test thumbnail url since it can change due to caching
    expect(result.playlist).toEqual(expected);

    result.tracks.forEach((track) => {
      expect(track.playlist).toBeDefined();
      expect({ ...track.playlist, thumbnailUrl: undefined }).toEqual(expected);
      expect(track.playlist).toBe(result.playlist);
    });
  });

  it.concurrent("searches playlist with limit", async () => {
    const limit = 64;
    const searchResults = await spotifyEngine.search(
      "https://open.spotify.com/playlist/3xMQTDLOIGvj3lWH5e5x6F",
      {},
      { limit }
    );

    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBe(limit);
  });

  it("gets stream", async () => {
    const youtubeSearchSpy = vi.spyOn(youtubeEngine, "search");
    const youtubeStreamSpy = vi.spyOn(youtubeEngine, "getStream");

    const stream = await spotifyEngine.getStream(expectedTrack, {});
    expect(stream).not.toBeNull();
    expect(stream?.stream).toBeInstanceOf(Readable);
    expect(youtubeSearchSpy).toHaveBeenCalledOnce();
    expect(youtubeSearchSpy).toHaveBeenCalledWith(
      "Despacito Luis Fonsi, Daddy Yankee",
      {},
      { limit: 1 }
    );
    expect(youtubeStreamSpy).toHaveBeenCalledOnce();
  });
});
