import { IAudioMetadata, parseFile } from "music-metadata";
import path from "path";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
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

  it("is responsible", async () => {
    const validQueries: string[] = [
      `${fileRoot}/file.mp3`,
      `${fileRoot}/subdir/file.mp3`,
      `${fileRoot}/subdir/subsubdir/file.mp3`,
    ];

    const invalidQueries: string[] = [
      fileRoot,
      `${fileRoot}/`,
      "/somedir/file.mp3",
    ];

    // should not be responsible when fileRoot option is not set
    for (const query of [...validQueries, ...invalidQueries]) {
      const isResponsible = await fileEngine.isResponsible(query, {});
      expect(isResponsible).toBe(false);
    }

    // check responsibility with fileRoot option
    for (const query of validQueries) {
      const isResponsible = await fileEngine.isResponsible(query, { fileRoot });
      expect(isResponsible).toBe(true);
    }
    for (const query of invalidQueries) {
      const isResponsible = await fileEngine.isResponsible(query, { fileRoot });
      expect(isResponsible).toBe(false);
    }
  });

  it("searches track with metadata", async () => {
    // should return no result when fileRoot is not set
    let searchResults = await fileEngine.search(expectedTrack.url, {}, {});
    expect(searchResults.length).toBe(0);

    // should return result when fileRoot is set
    searchResults = await fileEngine.search(
      expectedTrack.url,
      { fileRoot },
      {}
    );
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.playlist).toBeUndefined();
    expect(result.source).toBe("file");
    expect(result.tracks.length).toBe(1);

    const track = result.tracks[0];
    expect(track).toBeDefined();
    expect(track).toEqual(expectedTrack);
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

    let searchResults = await fileEngine.search(
      expectedTrack.url,
      { fileRoot },
      {}
    );
    const result = searchResults[0];
    expect(result).toBeDefined();
    expect(result.playlist).toBeUndefined();
    expect(result.source).toBe("file");
    expect(result.tracks.length).toBe(1);

    const track = result.tracks[0];
    expect(track).toBeDefined();
    expect(track).toEqual(expectedTrack);

    // handles metadata error
    (parseFile as Mock).mockImplementation(() => {
      throw Error("This should be handled");
    });
    searchResults = await fileEngine.search(
      expectedTrack.url,
      { fileRoot },
      {}
    );
    expect(searchResults.length).toBe(0);
  });

  it("gets stream", async () => {
    let stream = await fileEngine.getStream(expectedTrack, {});
    expect(stream).toBeNull();

    stream = await fileEngine.getStream(expectedTrack, { fileRoot });
    expect(stream).not.toBeNull();
    expect(stream?.stream).toBe(expectedTrack.url);
  });
});
