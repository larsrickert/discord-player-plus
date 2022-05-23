import { Track } from "../../../src";
import { TrackFormattingOptions } from "../types/commands";

export function trackToMarkdown(
  track: Track,
  options?: TrackFormattingOptions
): string {
  const title = trackUrlToMarkdown(
    track.title,
    track.url,
    options?.escapeLinks
  );
  const formattedTrack = `${title} (${formatDuration(track.duration)}) von ${
    track.artist
  }`;
  return formattedTrack;
}

export function trackUrlToMarkdown(
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
