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
