import { describe, expect, it, test } from "vitest";
import { Track } from "../../types/engines";
import {
  formatDuration,
  trackToMarkdown,
  urlToMarkdown,
  validateVolume,
} from "../../utils/player";

describe.concurrent("player util", () => {
  test.each([
    [-1, false],
    [0, true],
    [1, true],
    [200, true],
    [201, false],
  ])(`validates volume $i -> %s`, (volume, isValid) => {
    expect(validateVolume(volume)).toBe(isValid);
  });

  it("formats track to markdown", () => {
    const track: Track = {
      title: "Example track",
      duration: 61,
      source: "file",
      url: "https://example.com",
    };

    expect(trackToMarkdown(track)).toBe(
      "[Example track](https://example.com) (01:01)",
    );

    expect(trackToMarkdown({ ...track, artist: "Test artist" })).toBe(
      "[Example track](https://example.com) (01:01), Test artist",
    );

    expect(trackToMarkdown(track, true)).toBe(
      "[Example track](<https://example.com>) (01:01)",
    );

    expect(trackToMarkdown({ ...track, artist: "Test artist" }, true)).toBe(
      "[Example track](<https://example.com>) (01:01), Test artist",
    );
  });

  it("formats url to markdown", () => {
    expect(urlToMarkdown("Example track", "https://example.com")).toBe(
      "[Example track](https://example.com)",
    );

    expect(urlToMarkdown("Example track", "https://example.com", true)).toBe(
      "[Example track](<https://example.com>)",
    );
  });

  test.each([
    [0, "00:00"],
    [4, "00:04"],
    [4.123, "00:04"],
    [42, "00:42"],
    [60, "01:00"],
    [90, "01:30"],
    [600, "10:00"],
    [3599, "59:59"],
    [3661, "01:01:01"],
    [360061, "100:01:01"],
  ])(`formats track duration $i -> %s`, (time, formatted) => {
    expect(formatDuration(time)).toBe(formatted);
  });
});
