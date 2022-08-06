import { beforeEach, describe, expect, it } from "vitest";
import de from "../languages/de.json";
import en from "../languages/en.json";
import { Player } from "../player";
import { PlayerManager } from "../player-manager";
import { PlayerEvents } from "../types/player";

// @see: https://stackoverflow.com/a/47514598
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDeepObjectKeys(obj: Record<string, any>) {
  return Object.keys(obj)
    .filter((key) => obj[key] instanceof Object)
    .map((key) => getDeepObjectKeys(obj[key]).map((k) => `${key}.${k}`))
    .reduce((x, y) => x.concat(y), Object.keys(obj))
    .sort();
}

describe("player manager", () => {
  let playerManager: PlayerManager;

  beforeEach(() => {
    playerManager = new PlayerManager();
  });

  it("gets and creates player", () => {
    const player = playerManager.get("TEST_GUILD_ID");
    expect(player).toBeDefined();
    expect(player.guildId).toBe("TEST_GUILD_ID");

    const player2 = playerManager.get("TEST_GUILD_ID");
    expect(player).toBe(player2);
  });

  it("overrides player settings", () => {
    expect(playerManager.options).toBeUndefined();

    playerManager = new PlayerManager({
      playerDefault: {
        initialVolume: 123,
      },
    });

    expect(playerManager.options).toBeDefined();
    expect(playerManager.options?.playerDefault?.initialVolume).toBe(123);

    const player = playerManager.get("TEST_GUILD_ID", { fileRoot: "./test" });
    expect(player.options.initialVolume).toBe(123);
    expect(player.options.fileRoot).toBe("./test");
  });

  it("finds player", () => {
    let player = playerManager.find("TEST_GUILD_ID");
    expect(player).toBeUndefined();

    playerManager.get("TEST_GUILD_ID");
    player = playerManager.find("TEST_GUILD_ID");
    expect(player).toBeDefined();
  });

  it("removes player", () => {
    let player: Player | undefined = playerManager.get("TEST_GUILD_ID");
    expect(player).toBeDefined();
    playerManager.remove("TEST_GUILD_ID");
    player = playerManager.find("TEST_GUILD_ID");
    expect(player).toBeUndefined();
  });

  it("proxies player events", () => {
    const player = playerManager.get("TEST_GUILD_ID");
    expect(player).toBeDefined();

    const events: (keyof PlayerEvents)[] = [
      "trackStart",
      "trackEnd",
      "error",
      "destroyed",
    ];

    events.forEach((event) => {
      let eventName = "";
      let guildId = "";

      playerManager.on(event, (id) => {
        eventName = event;
        guildId = id;
      });
      player.emit(event);

      expect(eventName).toBe(event);
      expect(guildId).toBe("TEST_GUILD_ID");
    });
  });

  it("has default en translations", () => {
    expect(playerManager.translations).toBe(en);
  });

  it("translations contain same keys", () => {
    const enKeys = getDeepObjectKeys(en);
    const deKeys = getDeepObjectKeys(de);
    expect(enKeys).toEqual(deKeys);
  });
});
