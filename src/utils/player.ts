import { Track } from "../types/engines";

/**
 * Checks whether the volume is between 0 and 200.
 */
export function validateVolume(volume: number): boolean {
  return volume >= 0 && volume <= 200;
}

export function trackToMarkdown(track: Track, escapeUrl = false): string {
  const title = urlToMarkdown(track.title, track.url, escapeUrl);
  const formattedTrack = `${title} (${formatDuration(track.duration)})`;
  return track.artist ? `${formattedTrack}, ${track.artist}` : formattedTrack;
}

export function urlToMarkdown(
  title: string,
  url: string,
  escape = false
): string {
  return escape ? `[${title}](<${url}>)` : `[${title}](${url})`;
}

export function formatDuration(durationInSecs: number): string {
  const seconds = Math.floor(durationInSecs % 60);
  const minutes = Math.floor((durationInSecs / 60) % 60);
  const hours = Math.floor(durationInSecs / 3600);

  if (hours) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
