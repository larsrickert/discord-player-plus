import { Track } from "../types/engines";

/**
 * Randomly shuffles the given array in place.
 */
export function shuffle<T = unknown>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Checks whether the volume is between 0 and 200.
 */
export function validateVolume(volume: number): boolean {
  return volume >= 0 && volume <= 200;
}

export function trackToMarkdown(track: Track, escapeUrl = false): string {
  const title = urlToMarkdown(track.title, track.url, escapeUrl);
  const formattedTrack = `${title} (${formatDuration(track.duration)}), ${
    track.artist
  }`;
  return formattedTrack;
}

export function urlToMarkdown(
  title: string,
  url: string,
  escape = false
): string {
  return escape ? `[${title}](<${url}>)` : `[${title}](${url})`;
}

export function formatDuration(durationInSecs: number): string {
  const minutes = Math.floor(durationInSecs / 60);
  const seconds = durationInSecs % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
