import { describe, expect, it } from "vitest";
import { Playlist, Track } from "../types/engines";
import { spotifyEngine } from "./spotify";

describe("spotify engine", () => {
  const expectedTrack: Track = {
    url: "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb",
    title: "Despacito",
    duration: 229,
    source: "spotify",
    artist: "Luis Fonsi, Daddy Yankee",
  };

  it("is responsible", async () => {
    const queries: string[] = [
      "https://open.spotify.com/",
      "http://open.spotify.com/",
    ];

    for (const query of queries) {
      const isResponsible = spotifyEngine.isResponsible(query, {});
      expect(isResponsible).toBe(true);
    }
  });

  it("searches track", async () => {
    const queries: string[] = [
      "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb?si=a956465f4cc848cc",
      "https://open.spotify.com/embed/track/6habFhsOp2NvshLv26DqMb",
    ];

    const promises = queries.map(async (query) => {
      const searchResults = await spotifyEngine.search(query, {}, {});
      const result = searchResults[0];
      expect(result).toBeDefined();
      expect(result.tracks.length).toBeGreaterThanOrEqual(1);
      expect(result.source).toBe("spotify");
      expect(result.playlist).toBeUndefined();
      const track = result.tracks[0];
      // do not test thumbnail url since it can change due to caching
      expect({ ...track, thumbnailUrl: undefined }).toEqual(expectedTrack);
    });

    await Promise.all(promises);
  });

  it("searches playlist", async () => {
    const queries: string[] = [
      "https://open.spotify.com/playlist/3xMQTDLOIGvj3lWH5e5x6F",
    ];

    const promises = queries.map(async (query) => {
      const searchResults = await spotifyEngine.search(query, {}, {});
      const result = searchResults[0];
      expect(result).toBeDefined();
      expect(result.tracks.length).toBeGreaterThanOrEqual(1);
      expect(result.source).toBe("spotify");
      expect(result.playlist).toBeDefined();
      expect(result.tracks.length).toBe(100);

      const expected: Playlist = {
        title:
          "Charts 2022 🔥Top 100 Aktuelle Charts Radio Hits 2022 - Musik Mix - Summer - Pop Songs - Top 2022",
        url: "https://open.spotify.com/playlist/3xMQTDLOIGvj3lWH5e5x6F",
      };

      // do not test thumbnail url since it can change due to caching
      expect({ ...result.playlist, thumbnailUrl: undefined }).toEqual(expected);

      result.tracks.forEach((track) => {
        expect(track.playlist).toBeDefined();
        expect({ ...track.playlist, thumbnailUrl: undefined }).toEqual(
          expected
        );
        expect(track.playlist).toBe(result.playlist);
      });
    });

    await Promise.all(promises);
  });
});
