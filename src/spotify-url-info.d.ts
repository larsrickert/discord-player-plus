// the spotify-url-info removed its types, so we need to declare them here
// TODO: consider creating a PR for spotify-url-info to use TypeScript

declare module "spotify-url-info" {
  interface Spotify {
    getData<T = unknown>(url: string, options?: object): Promise<T>;
    getPreview(url: string, options?: object): Promise<Preview>;
    getTracks(url: string, options?: object): Promise<Tracks[]>;
    getDetails(
      url: string,
      options?: object,
    ): Promise<{ preview: Preview; tracks: Tracks[] }>;
  }

  export interface Preview {
    title: string;
    type: string;
    track: string;
    artist: string;
    image: string;
    audio: string;
    link: string;
    embed: string;
    date: string;
    description: string;
  }

  export interface Tracks {
    name: string;
    /** @example "spotify:track:some-id" */
    uri: string;
    /** Duration in milliseconds. */
    duration: number;
    previewUrl?: string;
    artist?: string;
  }

  export default function spotify(fetch: unknown): Spotify;
}
