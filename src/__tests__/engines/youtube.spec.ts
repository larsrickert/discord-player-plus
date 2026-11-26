import { Readable } from "node:stream";
import { VideoSummary } from "@distube/ytdl-core";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mock, mockClear } from "vitest-mock-extended";
import { youtubeEngine } from "../../engines/youtube.js";
import { Playlist, Track } from "../../index.js";

const ytdlMock = vi.hoisted(() => ({
  search: vi.fn(),
  getPlaylist: vi.fn(),
  download: vi.fn(),
}));

vi.mock("@distube/ytdl-core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@distube/ytdl-core")>()),
  Ytdl: vi.fn(function () {
    return ytdlMock;
  }),
}));

describe.concurrent("youtube engine", () => {
  const mockVideo = mock<VideoSummary>({
    title: "testTitle",
    lengthSeconds: 123,
    author: { name: "testArtist" },
    url: "testUrl",
    thumbnails: [{ url: "testThumbnail" }],
  });

  const expectedTrack: Track = {
    artist: "testArtist",
    duration: 123,
    source: "youtube",
    thumbnailUrl: "testThumbnail",
    title: "testTitle",
    url: "testUrl",
  };

  beforeEach(() => {
    mockClear(mockVideo);
    vi.resetAllMocks();
  });

  test("should have correct source", () => {
    expect(youtubeEngine.source).toBe("youtube");
  });

  test.each([
    "https://www.youtube.com/",
    "https://youtube.com/",
    "https://youtu.be/",
    "https://music.youtube.com/",
  ])("is responsible for %s", (query) => {
    let isResponsible = youtubeEngine.isResponsible(query);
    expect(isResponsible).toBe(true);

    isResponsible = youtubeEngine.isResponsible(query.replace("https://", "http://"));
    expect(isResponsible).toBe(true);
  });

  test("should not return search results for empty query", async () => {
    const result = await youtubeEngine.search("   ", {}, {});
    expect(result).toBeNull();
  });

  test("should return search results for video query", async () => {
    ytdlMock.search.mockResolvedValue([mockVideo]);

    const query = "never gonna give you up";

    const result = await youtubeEngine.search(query, {}, {});

    expect(ytdlMock.search).toHaveBeenCalledWith(query, {
      type: "video",
      limit: undefined,
    });
    expect(result).toStrictEqual({
      source: "youtube",
      tracks: [expectedTrack],
    });
  });

  test("should return search results for playlist query", async () => {
    ytdlMock.getPlaylist.mockResolvedValue({
      title: "testPlaylistTitle",
      url: "testPlaylistUrl",
      thumbnails: [{ url: "testPlaylistThumbnail" }],
      videos: [mockVideo],
    });

    const query = "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMHjMZOz59Ff6a4Ufc";

    const result = await youtubeEngine.search(query, {}, {});

    const expectedPlaylist: Playlist = {
      title: "testPlaylistTitle",
      url: "testPlaylistUrl",
      thumbnailUrl: "testPlaylistThumbnail",
    };

    expect(ytdlMock.getPlaylist).toHaveBeenCalledWith(query, {
      limit: undefined,
    });

    expect(result).toStrictEqual({
      source: "youtube",
      playlist: expectedPlaylist,
      tracks: [{ ...expectedTrack, playlist: expectedPlaylist }],
    });
  });

  test("searches tracks with limit", async () => {
    ytdlMock.search.mockResolvedValue([mockVideo]);

    const limit = 4;
    await youtubeEngine.search(expectedTrack.title, {}, { limit });

    expect(ytdlMock.search).toHaveBeenCalledWith(expectedTrack.title, {
      type: "video",
      limit,
    });
  });

  test("searches playlist with limit", async () => {
    ytdlMock.getPlaylist.mockResolvedValue({
      title: "testPlaylistTitle",
      url: "testPlaylistUrl",
      thumbnails: [{ url: "testPlaylistThumbnail" }],
      videos: [mockVideo],
    });

    const query = "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMHjMZOz59Ff6a4Ufc";

    await youtubeEngine.search(query, {}, { limit: 42 });
    expect(ytdlMock.getPlaylist).toHaveBeenLastCalledWith(query, { limit: 42 });

    await youtubeEngine.search(query, {}, {});
    expect(ytdlMock.getPlaylist).toHaveBeenLastCalledWith(query, {
      limit: undefined,
    });
  });

  test("gets stream", async () => {
    const mockStream = new Readable();
    ytdlMock.download.mockReturnValue(mockStream);

    const stream = await youtubeEngine.getStream(expectedTrack, {
      quality: "high",
    });
    expect(ytdlMock.download).toHaveBeenCalledWith(expectedTrack.url, {
      quality: "highestaudio",
      filter: { hasAudio: true, hasVideo: false },
      startTimeMs: undefined,
    });
    expect(stream).toStrictEqual({ stream: mockStream, type: "arbitrary" });
  });
});
