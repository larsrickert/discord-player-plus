import { describe, expect, test } from "vitest";
import { isSubPath } from "../../utils/fs";

describe.concurrent("fs util", () => {
  test.each([
    ["test.mp3", "/", true],
    ["test.mp3", "", true],
    ["/public/test.mp3", "/public", true],
    ["/public/sub/test.mp3", "/public", true],
    ["/public", "/public", false],
    ["/public/", "/public", false],
    ["test.mp3", "/public", false],
    ["/etc", "/public", false],
    ["/public/test.mp3", "/public/test", false],
  ])(`is %s sub path of %s -> %s`, (subPath, root, shouldBeSubPath) => {
    expect(isSubPath(root, subPath)).toBe(shouldBeSubPath);
  });
});
