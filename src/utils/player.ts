import { Track } from "../types/engines";

/**
 * Checks whether the volume is between 0 and 200 and therefore accepted by a player.
 */
export function validateVolume(volume: number): boolean {
  return volume >= 0 && volume <= 200;
}

/**
 * Formats the given track to a user friendly markdown string.
 * Format: `{title} ({duration}), {artist}`.
 *
 * @param track Track to format.
 * @param escapeUrl Whether to escape the markdown url. Discord will not show a track/url preview then.
 */
export function trackToMarkdown(track: Track, escapeUrl = false): string {
  const title = urlToMarkdown(track.title, track.url, escapeUrl);
  const formattedTrack = `${title} (${formatDuration(track.duration)})`;
  return track.artist ? `${formattedTrack}, ${track.artist}` : formattedTrack;
}

/**
 * Formats the given URL as markdown URL.
 *
 * @param title URL title.
 * @param url URL.
 * @param escape Whether to escape the markdown url. Discord will not show a track/url preview then.
 */
export function urlToMarkdown(
  title: string,
  url: string,
  escape = false
): string {
  return escape ? `[${title}](<${url}>)` : `[${title}](${url})`;
}

/**
 * Formats a number as user friendly track duration with format hh:mm:ss. Will not include hours if duration is smaller than one hour.
 */
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
