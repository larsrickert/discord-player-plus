import { Readable } from "stream";
import { describe, expect, it, test } from "vitest";
import { youtubeEngine } from "../../engines/youtube";
import { Playlist, Track } from "../../types/engines";

describe.concurrent("youtube engine", () => {
  const expectedTrack: Track = {
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    duration: 282,
    source: "youtube",
    artist: "Luis Fonsi",
  };

  test.each([
    "https://www.youtube.com/",
    "http://www.youtube.com/",
    "https://youtube.com/",
    "http://youtube.com/",
    "https://youtu.be/",
    "http://youtu.be/",
    "https://music.youtube.com/",
    "http://music.youtube.com/",
  ])("is responsible for %s", (query) => {
    const isResponsible = youtubeEngine.isResponsible(query, {});
    expect(isResponsible).toBe(true);
  });

  test.each([
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://youtube.com/watch?v=kJQP7kiw5Fk",
    "Luis Fonsi - Despacito",
    "https://youtu.be/kJQP7kiw5Fk",
    "https://music.youtube.com/watch?v=kJQP7kiw5Fk",
  ])("searches track %s", async (query) => {
    const searchResults = await youtubeEngine.search(query, {}, {});
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBeGreaterThanOrEqual(1);
    expect(result.source).toBe("youtube");
    expect(result.playlist).toBeUndefined();
    const track = result.tracks[0];
    // do not test thumbnail url since it can change due to caching
    expect({ ...track, thumbnailUrl: undefined }).toEqual(expectedTrack);
  });

  test.each([
    "https://www.youtube.com/watch?v=H5v3kku4y6Q&list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
    "https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
    "https://music.youtube.com/watch?v=H5v3kku4y6Q&list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
  ])("searches playlist %s", async (query) => {
    const searchResults = await youtubeEngine.search(query, {}, {});
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBeGreaterThanOrEqual(1);
    expect(result.source).toBe("youtube");
    expect(result.playlist).toBeDefined();
    expect(result.tracks.length).toBe(100);

    const expected: Playlist = {
      title: "TOP 100 Songs of 2023 - Billboard Hot 100 - Music Playlist 2023",
      url: query.replace("music.youtube.com", "www.youtube.com"),
    };

    // do not test thumbnail url since it can change due to caching
    expect({ ...result.playlist, thumbnailUrl: undefined }).toEqual(expected);

    result.tracks.forEach((track) => {
      expect(track.playlist).toBeDefined();
      expect({ ...track.playlist, thumbnailUrl: undefined }).toEqual(expected);
      expect(track.playlist).toBe(result.playlist);
    });
  });

  it("searches tracks with limit", async () => {
    const limit = 4;
    const searchResults = await youtubeEngine.search(
      "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      {},
      { limit }
    );

    // TODO: refactor search to return single SearchResult
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBe(limit);
  });

  it("searches playlist with limit", async () => {
    const limit = 128;
    const searchResults = await youtubeEngine.search(
      "https://www.youtube.com/playlist?list=PLMC9KNkIncKseYxDN2niH6glGRWKsLtde",
      {},
      { limit }
    );

    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBe(limit);
  });

  it("gets stream", async () => {
    const stream = await youtubeEngine.getStream(expectedTrack, {});
    expect(stream).not.toBeNull();
    expect(stream?.stream).toBeInstanceOf(Readable);
  });
});
