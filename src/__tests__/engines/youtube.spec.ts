import {
  playlist_info,
  search,
  stream,
  YouTubeChannel,
  YouTubePlayList,
  YouTubeVideo,
} from "play-dl";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { youtubeEngine } from "../../engines/youtube";
import { Playlist, Track } from "../../types/engines";

const expectedTrack = {
  url: "testUrl",
  title: "testTitle",
  duration: 123,
  source: "youtube",
  artist: "testArtist",
  thumbnailUrl: "testThumbnail",
} satisfies Track;

const expectedPlaylist = {
  title: "testPlaylistTitle",
  url: "testPlaylistUrl",
  thumbnailUrl: "testPlaylistThumbnail",
} satisfies Playlist;

vi.mock("play-dl", async (importOriginal) => {
  const module: Record<string, unknown> = await importOriginal();

  return {
    ...module,
    stream: vi.fn(),
    search: vi.fn(() => [
      {
        ...mock<YouTubeVideo>(),
        url: expectedTrack.url,
        title: expectedTrack.title,
        durationInSec: expectedTrack.duration,
        channel: {
          ...mock<YouTubeChannel>(),
          name: expectedTrack.artist,
        },
        thumbnails: [
          {
            height: 0,
            width: 0,
            url: expectedTrack.thumbnailUrl,
            toJSON: vi.fn(),
          },
        ] as YouTubeVideo["thumbnails"],
      },
    ]),
    playlist_info: vi.fn(() => ({
      ...mock<YouTubePlayList>(),
      title: expectedPlaylist.title,
      url: expectedPlaylist.url,
      thumbnail: {
        height: 0,
        width: 0,
        url: expectedPlaylist.thumbnailUrl,
        toJSON: vi.fn(),
      } as YouTubePlayList["thumbnail"],
      page: vi.fn(() =>
        new Array(100).fill("").map(() => ({
          ...mock<YouTubeVideo>(),
          url: expectedTrack.url,
          title: expectedTrack.title,
          durationInSec: expectedTrack.duration,
          channel: {
            ...mock<YouTubeChannel>(),
            name: expectedTrack.artist,
          },
          thumbnails: [
            {
              height: 0,
              width: 0,
              url: expectedTrack.thumbnailUrl,
              toJSON: vi.fn(),
            },
          ] as YouTubeVideo["thumbnails"],
        }))
      ),
      next: vi.fn((limit?: number) =>
        new Array(limit ?? 100).fill("").map(() => ({
          ...mock<YouTubeVideo>(),
          url: expectedTrack.url,
          title: expectedTrack.title,
          durationInSec: expectedTrack.duration,
          channel: {
            ...mock<YouTubeChannel>(),
            name: expectedTrack.artist,
          },
          thumbnails: [
            {
              height: 0,
              width: 0,
              url: expectedTrack.thumbnailUrl,
              toJSON: vi.fn(),
            },
          ] as YouTubeVideo["thumbnails"],
        }))
      ),
      all_videos: vi.fn(() =>
        new Array(250).fill("").map(() => ({
          ...mock<YouTubeVideo>(),
          url: expectedTrack.url,
          title: expectedTrack.title,
          durationInSec: expectedTrack.duration,
          channel: {
            ...mock<YouTubeChannel>(),
            name: expectedTrack.artist,
          },
          thumbnails: [
            {
              height: 0,
              width: 0,
              url: expectedTrack.thumbnailUrl,
              toJSON: vi.fn(),
            },
          ] as YouTubeVideo["thumbnails"],
        }))
      ),
    })),
  };
});

describe.concurrent("YouTube engine", () => {
  it("has source", () => {
    expect(youtubeEngine.source).toBe("youtube");
  });

  it.each([
    "https://www.youtube.com/",
    "https://youtube.com/",
    "https://youtu.be/",
    "https://music.youtube.com/",
  ])("is responsible for %s", (query) => {
    let isResponsible = youtubeEngine.isResponsible(query);
    expect(isResponsible).toBe(true);

    isResponsible = youtubeEngine.isResponsible(
      query.replace("https://", "http://")
    );
    expect(isResponsible).toBe(true);
  });

  it("should search track", async () => {
    const result = await youtubeEngine.search(expectedTrack.url, {}, {});
    expect(search).toHaveBeenCalledWith(expectedTrack.url, {
      source: { youtube: "video" },
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].source).toBe(youtubeEngine.source);
    expect(result[0].tracks.length).toBe(1);
    expect(result[0].tracks[0]).toEqual(expectedTrack);
  });

  it("should handle search with minimal video information", async () => {
    const minimalVideo = {
      url: expectedTrack.url,
      chapters: [],
      durationInSec: expectedTrack.duration,
      durationRaw: "",
      likes: 0,
      live: false,
      private: false,
      tags: [],
      thumbnails: [],
      toJSON: vi.fn(),
      toString: vi.fn(),
      type: "video",
      views: 0,
    } satisfies YouTubeVideo;

    const expected = {
      url: expectedTrack.url,
      duration: expectedTrack.duration,
      source: expectedTrack.source,
      title: "",
    } satisfies Track;

    const playDl = await import("play-dl");
    vi.spyOn(playDl, "search").mockReturnValue(Promise.resolve([minimalVideo]));

    const result = await youtubeEngine.search(minimalVideo.url, {}, {});
    expect(search).toHaveBeenCalledWith(expectedTrack.url, {
      source: { youtube: "video" },
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].source).toBe(youtubeEngine.source);
    expect(result[0].tracks.length).toBe(1);
    expect(result[0].tracks[0]).toEqual(expected);
  });

  it.each([
    "https://www.youtube.com/watch?v=H5v3kku4y6Q&list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
    "https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
    "https://music.youtube.com/watch?v=H5v3kku4y6Q&list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
  ])("should search playlist %s", async (query) => {
    const results = await youtubeEngine.search(query, {}, {});
    expect(playlist_info).toHaveBeenCalledWith(query, { incomplete: true });
    expect(results.length).toBeGreaterThanOrEqual(1);

    const result = results[0];
    expect(result).toBeDefined();

    expect(result.source).toBe(youtubeEngine.source);
    expect(result.tracks.length).toBe(250);
    expect(result.tracks[0]).toEqual({
      ...expectedTrack,
      playlist: expectedPlaylist,
    });
    expect(result.playlist).toEqual(expectedPlaylist);
    expect(result.playlist).toBe(result.tracks[0].playlist);
  });

  it("searches tracks with limit", async () => {
    const limit = 4;
    await youtubeEngine.search(expectedTrack.url, {}, { limit });

    expect(search).toHaveBeenCalledWith(expectedTrack.url, {
      source: { youtube: "video" },
      limit,
    });
  });

  it("searches playlist with limit", async () => {
    const limit = 128;
    const searchResults = await youtubeEngine.search(
      "https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU",
      {},
      { limit }
    );

    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.tracks.length).toBe(limit);
  });

  it("gets stream", async () => {
    await youtubeEngine.getStream(expectedTrack, { quality: "high" });
    expect(stream).toHaveBeenCalledWith(expectedTrack.url, {
      quality: 2,
      seek: undefined,
    });
  });
});
