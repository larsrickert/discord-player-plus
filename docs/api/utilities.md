# Utilities

`discord-player-plus` provides some utility functions that you might find useful for certain use cases.

## validateVolume()

Checks whether the volume is between 0 and 200 and therefore accepted by a player.

- **Type**

  ```ts
  function validateVolume(volume: number): boolean;
  ```

## trackToMarkdown()

Formats the given track to a user friendly markdown string with linked track title (url). <br>
Format: `{title} ({duration}), {artist}`.

- **Type**

  ```ts
  function trackToMarkdown(track: Track, escapeUrl?: boolean): string;
  ```

- **Details**

  If `escapeUrl` is set to `true`, the markdown url will be escaped so discord will not show a track/url preview.

- **Example**

  ```ts
  const track: Track = {
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    title: "Despacito",
    duration: 282,
    source: "youtube",
    artist: "Luis Fonsi",
  };

  const markdown = trackToMarkdown(track);
  // output of rendered markdown: Despacito (04:42), Luis Fonsi
  ```

## urlToMarkdown()

Formats the given URL as markdown URL.

- **Type**

  ```ts
  function urlToMarkdown(title: string, url: string, escape?: boolean): string;
  ```

- **Details**

  If `escape` is set to `true`, the markdown url will be escaped so discord will not show a track/url preview.

## formatDuration()

Formats a number as user friendly track duration with format `hh:mm:ss`. Will not include hours if duration is smaller than one hour.

- **Type**

  ```ts
  function formatDuration(durationInSecs: number): string;
  ```

- **Example**

  ```ts
  formatDuration(42); // output: 00:42
  formatDuration(90); // output: 01:30
  formatDuration(3600); // output: 01:00:00
  formatDuration(360061); // output: 100:01:01
  ```
