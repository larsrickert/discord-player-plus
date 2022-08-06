import { describe, expect, it } from "vitest";
import { isSubPath } from "../../utils/fs";

interface Path {
  root: string;
  subpath: string;
}

describe("fs util", () => {
  it("recognized sub paths", () => {
    const validPaths: Path[] = [
      {
        root: "/",
        subpath: "test.mp3",
      },
      {
        root: "",
        subpath: "test.mp3",
      },
      {
        root: "/public",
        subpath: "/public/test.mp3",
      },
      {
        root: "/public",
        subpath: "/public/sub/test.mp3",
      },
    ];
    const invalidPaths: Path[] = [
      {
        root: "/public",
        subpath: "/public",
      },
      {
        root: "/public",
        subpath: "/public/",
      },
      {
        root: "/public",
        subpath: "test.mp3",
      },
      {
        root: "/public",
        subpath: "/etc",
      },
      {
        root: "/public/test",
        subpath: "public/test.mp3",
      },
    ];

    validPaths.forEach((path) => {
      expect(isSubPath(path.root, path.subpath)).toBe(true);
    });

    invalidPaths.forEach((path) => {
      expect(isSubPath(path.root, path.subpath)).toBe(false);
    });
  });
});
