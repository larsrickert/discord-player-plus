import { describe, expect, it } from "vitest";
import { Track } from "../types/engines";
import {
  formatDuration,
  trackToMarkdown,
  urlToMarkdown,
  validateVolume,
} from "../utils/player";

describe("player util", () => {
  it("validates volume", () => {
    const testCases = [
      { input: -1, expected: false },
      { input: 0, expected: true },
      { input: 1, expected: true },
      { input: 200, expected: true },
      { input: 201, expected: false },
    ];

    testCases.forEach((c) => {
      expect(validateVolume(c.input)).toBe(c.expected);
    });
  });

  it("formats track to markdown", () => {
    const track: Track = {
      title: "Example track",
      duration: 61,
      source: "file",
      url: "https://example.com",
    };

    expect(trackToMarkdown(track)).toBe(
      "[Example track](https://example.com) (01:01)"
    );

    expect(trackToMarkdown({ ...track, artist: "Test artist" })).toBe(
      "[Example track](https://example.com) (01:01), Test artist"
    );

    expect(trackToMarkdown(track, true)).toBe(
      "[Example track](<https://example.com>) (01:01)"
    );

    expect(trackToMarkdown({ ...track, artist: "Test artist" }, true)).toBe(
      "[Example track](<https://example.com>) (01:01), Test artist"
    );
  });

  it("formats url to markdown", () => {
    expect(urlToMarkdown("Example track", "https://example.com")).toBe(
      "[Example track](https://example.com)"
    );

    expect(urlToMarkdown("Example track", "https://example.com", true)).toBe(
      "[Example track](<https://example.com>)"
    );
  });

  it("formats track duration", () => {
    const testCases = [
      { input: 0, expected: "00:00" },
      { input: 4, expected: "00:04" },
      { input: 4.123, expected: "00:04" },
      { input: 42, expected: "00:42" },
      { input: 60, expected: "01:00" },
      { input: 90, expected: "01:30" },
      { input: 600, expected: "10:00" },
      { input: 3599, expected: "59:59" },
      { input: 3661, expected: "01:01:01" },
      { input: 360061, expected: "100:01:01" },
    ];

    testCases.forEach((c) => {
      expect(formatDuration(c.input)).toBe(c.expected);
    });
  });
});
