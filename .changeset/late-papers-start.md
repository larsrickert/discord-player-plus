---
"discord-player-plus": major
---

Update all dependencies so the player works again with the latest discord and node version.

Breaking changes:

- require Node 26 (might still work with 24 and 22)
- drop CJS support, package is now ESM only
- remove "medium" from player option `quality`
- require up-to-date `discord.js` and `@discordjs/*` dependencies
