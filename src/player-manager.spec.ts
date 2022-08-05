import { beforeEach, describe, expect, it } from "vitest";
import { Player } from "./player";
import { PlayerManager } from "./player-manager";

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
});
