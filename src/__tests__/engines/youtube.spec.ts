import playDl, { YouTubePlayList, YouTubeStream, YouTubeVideo } from "play-dl";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mock, mockClear } from "vitest-mock-extended";
import { Playlist, Track } from "../..";
import { youtubeEngine } from "../../engines/youtube";

describe.concurrent("youtube engine", () => {
  const mockVideo = mock<YouTubeVideo>({
    title: "testTitle",
    durationInSec: 123,
    channel: { name: "testArtist" },
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

    isResponsible = youtubeEngine.isResponsible(
      query.replace("https://", "http://")
    );
    expect(isResponsible).toBe(true);
  });

  test("should not return search results for empty query", async () => {
    const result = await youtubeEngine.search("   ", {}, {});
    expect(result).toBeNull();
  });

  test("should return search results for video query", async () => {
    const searchSpy = vi.spyOn(playDl, "search").mockResolvedValue([mockVideo]);

    const query = "https://www.youtube.com/watch?v=testVideoId";

    const result = await youtubeEngine.search(query, {}, {});

    expect(searchSpy).toHaveBeenCalledWith(query, {
      source: { youtube: "video" },
    });
    expect(result).toStrictEqual({
      source: "youtube",
      tracks: [expectedTrack],
    });
  });

  test("should return search results for playlist query", async () => {
    const playlistInfoSpy = vi.spyOn(playDl, "playlist_info").mockResolvedValue(
      mock<YouTubePlayList>({
        all_videos: vi.fn(() => Promise.resolve([mockVideo])),
        title: "testPlaylistTitle",
        url: "testPlaylistUrl",
        thumbnail: { url: "testPlaylistThumbnail" },
      })
    );

    const validateSpy = vi
      .spyOn(playDl, "yt_validate")
      .mockReturnValue("playlist");

    const query = "https://www.youtube.com/playlist?list=testPlaylistId";

    const result = await youtubeEngine.search(query, {}, {});

    const expectedPlaylist: Playlist = {
      title: "testPlaylistTitle",
      url: "testPlaylistUrl",
      thumbnailUrl: "testPlaylistThumbnail",
    };

    expect(validateSpy).toHaveBeenCalledWith(query);
    expect(playlistInfoSpy).toHaveBeenCalledWith(query, { incomplete: true });

    expect(result).toStrictEqual({
      source: "youtube",
      playlist: expectedPlaylist,
      tracks: [{ ...expectedTrack, playlist: expectedPlaylist }],
    });
  });

  test("searches tracks with limit", async () => {
    const searchSpy = vi.spyOn(playDl, "search").mockResolvedValue([mockVideo]);

    const limit = 4;
    await youtubeEngine.search(expectedTrack.url, {}, { limit });

    expect(searchSpy).toHaveBeenCalledWith(expectedTrack.url, {
      source: { youtube: "video" },
      limit,
    });
  });

  test("searches playlist with limit", async () => {
    const mockPlaylist = mock<YouTubePlayList>({
      all_videos: vi.fn(() => Promise.resolve([mockVideo])),
      page: vi.fn(() => [mockVideo]),
      next: vi.fn(() => Promise.resolve([mockVideo])),
      title: "testPlaylistTitle",
      url: "testPlaylistUrl",
      thumbnail: { url: "testPlaylistThumbnail" },
    });

    vi.spyOn(playDl, "playlist_info").mockResolvedValue(mockPlaylist);
    vi.spyOn(playDl, "yt_validate").mockReturnValue("playlist");

    const query = "https://www.youtube.com/playlist?list=somePlaylistId";

    // limit < 100
    await youtubeEngine.search(query, {}, { limit: 42 });
    expect(mockPlaylist.page).toHaveBeenCalledWith(1);
    expect(mockPlaylist.all_videos).not.toHaveBeenCalled();

    // limit > 100
    mockClear(mockPlaylist);
    await youtubeEngine.search(query, {}, { limit: 128 });
    expect(mockPlaylist.next).toHaveBeenCalledWith(28);
    expect(mockPlaylist.all_videos).not.toHaveBeenCalled();

    // no limit
    mockClear(mockPlaylist);
    await youtubeEngine.search(query, {}, { limit: 0 });
    expect(mockPlaylist.all_videos).toHaveBeenCalled();
  });

  test("gets stream", async () => {
    const mockStream = mock<YouTubeStream>();
    const streamSpy = vi.spyOn(playDl, "stream").mockResolvedValue(mockStream);

    const stream = await youtubeEngine.getStream(expectedTrack, {
      quality: "high",
    });
    expect(streamSpy).toHaveBeenCalledWith(expectedTrack.url, {
      quality: 2,
      seek: undefined,
    });
    expect(stream).toStrictEqual(mockStream);
  });
});
