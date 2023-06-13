import { IAudioMetadata, parseFile } from "music-metadata";
import path from "path";
import { Mock, afterEach, describe, expect, it, test, vi } from "vitest";
import { fileEngine } from "../../engines/file";
import { Track } from "../../types/engines";

const mockMetadataWithoutData: IAudioMetadata = {
  common: {
    disk: { no: null, of: null },
    movementIndex: {},
    track: { no: null, of: null },
  },
  format: { trackInfo: [] },
  native: {},
  quality: {
    warnings: [],
  },
};

const mockMetadataWithData: IAudioMetadata = {
  ...mockMetadataWithoutData,
  common: {
    ...mockMetadataWithoutData.common,
    artists: ["Discord Player Plus", "Lars Rickert"],
    title: "discord-player-plus example audio file",
  },
  format: {
    ...mockMetadataWithoutData.format,
    duration: 42,
  },
};

vi.mock("fs/promises", async () => {
  const stat = vi.fn().mockImplementation(() => {
    return {
      isFile: vi.fn().mockImplementation(() => true),
    };
  });
  return { stat };
});

vi.mock("music-metadata", async () => {
  const parseFile = vi.fn().mockImplementation(() => mockMetadataWithData);
  return { parseFile };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("file engine", () => {
  const fileRoot = __dirname;

  const expectedTrack: Track = {
    // from file metadata
    url: path.join(fileRoot, "example.mp3"),
    title: "discord-player-plus example audio file",
    duration: 42,
    artist: "Discord Player Plus, Lars Rickert",
    source: "file",
  };

  test.concurrent.each([
    [`${fileRoot}/file.mp3`, true],
    [`${fileRoot}/subdir/file.mp3`, true],
    [`${fileRoot}/subdir/subsubdir/file.mp3`, true],
    [fileRoot, false],
    [`${fileRoot}/`, false],
    ["/somedir/file.mp3", false],
  ])(`is responsible for %s -> %s`, async (query, shouldBeResponsible) => {
    // should not be responsible when fileRoot option is not set
    let isResponsible = await fileEngine.isResponsible(query, {});
    expect(isResponsible).toBe(false);

    // check responsibility with fileRoot option
    isResponsible = await fileEngine.isResponsible(query, { fileRoot });
    expect(isResponsible).toBe(shouldBeResponsible);
  });

  it("searches track with metadata", async () => {
    // should return no result when fileRoot is not set
    let searchResult = await fileEngine.search(expectedTrack.url, {});
    expect(searchResult).toBe(null);

    // should return result when fileRoot is set
    searchResult = await fileEngine.search(expectedTrack.url, { fileRoot });
    expect(searchResult).toStrictEqual({
      source: "file",
      tracks: [expectedTrack],
    });
  });

  it("searches track without metadata", async () => {
    (parseFile as Mock).mockImplementation(() => mockMetadataWithoutData);

    const expectedTrack: Track = {
      // from file metadata
      url: path.join(fileRoot, "example.mp3"),
      title: "example.mp3",
      duration: 0,
      source: "file",
    };

    let searchResult = await fileEngine.search(expectedTrack.url, {
      fileRoot,
    });
    expect(searchResult).toEqual({
      source: "file",
      tracks: [expectedTrack],
    });

    // handles metadata error
    (parseFile as Mock).mockImplementation(() => {
      throw Error("This should be handled");
    });
    searchResult = await fileEngine.search(expectedTrack.url, { fileRoot });
    expect(searchResult).toBe(null);
  });

  it("gets stream", async () => {
    let stream = await fileEngine.getStream(expectedTrack, {});
    expect(stream).toBeNull();

    stream = await fileEngine.getStream(expectedTrack, { fileRoot });
    expect(stream).not.toBeNull();
    expect(stream?.stream).toBe(expectedTrack.url);
  });
});
