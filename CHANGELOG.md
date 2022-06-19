# 1.0.0 (2022-06-19)


### Bug Fixes

* `remove` not returning removed track ([9e7ab69](https://github.com/larsrickert/discord-player-plus/commit/9e7ab69f66c5703f00de56a70d746723d98ce04d))
* `trackToMarkdown` printing `undefined` when artist is not set ([e2e1b5a](https://github.com/larsrickert/discord-player-plus/commit/e2e1b5ad3036157e969adaa5b71ed0772b12a11a))
* add missing export `handleSlashCommand` ([cd88723](https://github.com/larsrickert/discord-player-plus/commit/cd887237d42de5b41eff5203b6bf046f7bc22681))
* **command:** queue command not using ephemeral ([cddd737](https://github.com/larsrickert/discord-player-plus/commit/cddd7378ec2aac669e69e1dad0b9bfcb2b3ca48c))
* **example:** use more user friendly ephemeral ([cf51239](https://github.com/larsrickert/discord-player-plus/commit/cf5123943d47262342f2d92fc6fef536fa8ff3d7))
* **player:** `add` playing track twice, `setPause` not returning `true` when already paused/resumed ([84a6a37](https://github.com/larsrickert/discord-player-plus/commit/84a6a370e0482aeb565dc195d0f15f5d06beae76))
* remove track url preview for `add` and `skip` command message ([a349c3f](https://github.com/larsrickert/discord-player-plus/commit/a349c3fde841387cc5362ab968dade51a3ba3531))
* remove vulnerable dependencies ([40c23c7](https://github.com/larsrickert/discord-player-plus/commit/40c23c720757d4689a8629e4fd690dec9f9ba66c))
* **spotify:** playing wrong stream when artist is undefined ([bbb3da4](https://github.com/larsrickert/discord-player-plus/commit/bbb3da4ab4f4d794fb959e75042b103af1f02ff6))
* volume glitch when async function is used for initial volume ([9f802bf](https://github.com/larsrickert/discord-player-plus/commit/9f802bfddf9df9a07dbdca9cd404b621328046aa))


### Code Refactoring

* **player-manager:** Add methods `find` and `remove` ([0458b8f](https://github.com/larsrickert/discord-player-plus/commit/0458b8f9dd7c3effcd332885a83cdf47701bfeb6))
* remove `SearchType` in favor of `TrackSource` ([32cb323](https://github.com/larsrickert/discord-player-plus/commit/32cb32320bf77ca168ab030ee867f1cac7cbde5f))
* rename event `disconnect` to `destroyed` ([2975507](https://github.com/larsrickert/discord-player-plus/commit/29755077c2e9ab6585af057390b0782f55656661))


### Documentation

* add vitepress documentation ([#1](https://github.com/larsrickert/discord-player-plus/issues/1)) ([c99d31c](https://github.com/larsrickert/discord-player-plus/commit/c99d31cfa5f3e088dee6d4ee81db07de1f59d0bc))


### Features

* add `duration` and `artist` to track ([bc6cbcb](https://github.com/larsrickert/discord-player-plus/commit/bc6cbcb90342e6d10d2d3887b69e0a81de94b82b))
* add `fileRoot` player option ([ba5d6a2](https://github.com/larsrickert/discord-player-plus/commit/ba5d6a2bf7a57f20f199b1e4819e42e4a0e48ff1))
* add `insert` and `remove` method ([ed5e35b](https://github.com/larsrickert/discord-player-plus/commit/ed5e35b4c2b0cda731535b02e01dc1ef86b6dba8))
* add `queueEnd` event ([0873c42](https://github.com/larsrickert/discord-player-plus/commit/0873c4293459d9c449925f4135e19641f48a50f0))
* add `SearchType` search option ([c486936](https://github.com/larsrickert/discord-player-plus/commit/c486936dddafe290641c7c286e78c0b3cbbe465e))
* add `seek` method ([23a00e8](https://github.com/larsrickert/discord-player-plus/commit/23a00e8eecea5422a2f5f143edfa7b1cc601b4c8))
* add player ([8390eec](https://github.com/larsrickert/discord-player-plus/commit/8390eec1771185d708a8933d0fc04a2882b72bb4))
* add player option `customEngines` ([ac411de](https://github.com/larsrickert/discord-player-plus/commit/ac411dee8f62bc2cc29b74c3bd43db7339679009))
* add PlayerManager ([a1d8ed9](https://github.com/larsrickert/discord-player-plus/commit/a1d8ed905deea5ca0b76c0dbcbfc8492cb04768a))
* add pre-build slash commands ([ede5993](https://github.com/larsrickert/discord-player-plus/commit/ede59939bcbd304f3841b465c152810c1bf31346))
* add spotify player engine ([159477d](https://github.com/larsrickert/discord-player-plus/commit/159477dcc2593e254d4feae0254c605f7996bcc8))
* commands `run` method returning boolean ([3031a21](https://github.com/larsrickert/discord-player-plus/commit/3031a216f4a62a385bedf30ceb9ea5651015bb25))
* **commands:** add command `seek` ([4fa37e9](https://github.com/larsrickert/discord-player-plus/commit/4fa37e96ecc043bfaa87604552e6097476abb691))
* **engines:** add `isResponsible` method ([dc58e90](https://github.com/larsrickert/discord-player-plus/commit/dc58e90a16f0a9ab456a3f4fb2332d4090044021))
* **player-manager:** add events ([251b07c](https://github.com/larsrickert/discord-player-plus/commit/251b07cf277c07d8df563cd2cf559d0c89e90ad2))
* **player-manager:** add option deep merge ([b42ea27](https://github.com/larsrickert/discord-player-plus/commit/b42ea277955faead8da9382dcfd836e5fb424e46))
* **player:** add `error` event ([fd23641](https://github.com/larsrickert/discord-player-plus/commit/fd23641d1938983a9f77a4004b1eeac2b49e10cd))
* **player:** add method `getVolume` ([4e9ee7c](https://github.com/larsrickert/discord-player-plus/commit/4e9ee7ca284c6dc54058a4c89fe6f5b5083d6100))
* **player:** add option `allowSwitchChannels` ([9bceb75](https://github.com/larsrickert/discord-player-plus/commit/9bceb757e8db3df9878b38cab42e1c705c4b9739))
* **player:** add play option `addSkippedTrackToQueue` ([9c4597e](https://github.com/larsrickert/discord-player-plus/commit/9c4597e107c6206144bb50cb754755360e5b1a1f))
* **player:** add repeat mode `NONE` and `TRACK` ([f97dc90](https://github.com/larsrickert/discord-player-plus/commit/f97dc903922f30ec7ac87de51f276bc2ecf89b98))
* **player:** make `fileRoot` option required for local files ([a0f1994](https://github.com/larsrickert/discord-player-plus/commit/a0f19945a09113456e2e98bbbd7472438010d76c))
* **player:** option `initialVolume` can be function ([2b3b9b2](https://github.com/larsrickert/discord-player-plus/commit/2b3b9b248ff14ddfbe6696958371a2d8b963de12))
* support spotify playlists ([744fabd](https://github.com/larsrickert/discord-player-plus/commit/744fabdb6f0105dda4991d8fb5f327b835db5371))


### BREAKING CHANGES

* change `handleSlashCommand` signature
* **player:** remove player event `queueEnd` in favor of `destroyed`
* **player:** player event `trackEnd` now emmited before next track started
* **player:** remove type `StreamOptions`
* **player:** remove parameter `streamOptions` from engines `getStream` method
* **player:** `fileRoot` option is required to play local files
* commands `run` method returning boolean
* remove player option `customSearch` and `customStream`  in favor of `customEngines`
* remove type `TrackSource`
* require engine prop `source`
* **engines:** remove exported function `detectTrackSource`
* **engines:** require method  `isResponsible` for engines
* **player-manager:** remove method `exists` in favor of `find`
* remove `SearchType` in favor of `TrackSource`
* rename event `disconnect` to `destroyed`

# [1.0.0-beta.11](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2022-06-19)


### Documentation

* add vitepress documentation ([#1](https://github.com/larsrickert/discord-player-plus/issues/1)) ([c99d31c](https://github.com/larsrickert/discord-player-plus/commit/c99d31cfa5f3e088dee6d4ee81db07de1f59d0bc))


### BREAKING CHANGES

* change `handleSlashCommand` signature

# [1.0.0-beta.10](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2022-06-19)


### Features

* **player-manager:** add events ([251b07c](https://github.com/larsrickert/discord-player-plus/commit/251b07cf277c07d8df563cd2cf559d0c89e90ad2))
* **player:** add `error` event ([fd23641](https://github.com/larsrickert/discord-player-plus/commit/fd23641d1938983a9f77a4004b1eeac2b49e10cd))


### BREAKING CHANGES

* **player:** remove player event `queueEnd` in favor of `destroyed`
* **player:** player event `trackEnd` now emmited before next track started

# [1.0.0-beta.9](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2022-06-18)


### Bug Fixes

* volume glitch when async function is used for initial volume ([9f802bf](https://github.com/larsrickert/discord-player-plus/commit/9f802bfddf9df9a07dbdca9cd404b621328046aa))

# [1.0.0-beta.8](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2022-06-18)


### Features

* **commands:** add command `seek` ([4fa37e9](https://github.com/larsrickert/discord-player-plus/commit/4fa37e96ecc043bfaa87604552e6097476abb691))
* **player:** add play option `addSkippedTrackToQueue` ([9c4597e](https://github.com/larsrickert/discord-player-plus/commit/9c4597e107c6206144bb50cb754755360e5b1a1f))


### BREAKING CHANGES

* **player:** remove type `StreamOptions`
* **player:** remove parameter `streamOptions` from engines `getStream` method

# [1.0.0-beta.7](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2022-06-18)


### Features

* **player:** option `initialVolume` can be function ([2b3b9b2](https://github.com/larsrickert/discord-player-plus/commit/2b3b9b248ff14ddfbe6696958371a2d8b963de12))

# [1.0.0-beta.6](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2022-06-18)


### Features

* **player:** add option `allowSwitchChannels` ([9bceb75](https://github.com/larsrickert/discord-player-plus/commit/9bceb757e8db3df9878b38cab42e1c705c4b9739))
* **player:** make `fileRoot` option required for local files ([a0f1994](https://github.com/larsrickert/discord-player-plus/commit/a0f19945a09113456e2e98bbbd7472438010d76c))


### BREAKING CHANGES

* **player:** `fileRoot` option is required to play local files

# [1.0.0-beta.5](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2022-06-17)


### Features

* commands `run` method returning boolean ([3031a21](https://github.com/larsrickert/discord-player-plus/commit/3031a216f4a62a385bedf30ceb9ea5651015bb25))
* **player:** add method `getVolume` ([4e9ee7c](https://github.com/larsrickert/discord-player-plus/commit/4e9ee7ca284c6dc54058a4c89fe6f5b5083d6100))
* **player:** add repeat mode `NONE` and `TRACK` ([f97dc90](https://github.com/larsrickert/discord-player-plus/commit/f97dc903922f30ec7ac87de51f276bc2ecf89b98))


### BREAKING CHANGES

* commands `run` method returning boolean

# [1.0.0-beta.4](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2022-06-10)


### Bug Fixes

* remove vulnerable dependencies ([40c23c7](https://github.com/larsrickert/discord-player-plus/commit/40c23c720757d4689a8629e4fd690dec9f9ba66c))

# [1.0.0-beta.3](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2022-06-07)


### Bug Fixes

* `trackToMarkdown` printing `undefined` when artist is not set ([e2e1b5a](https://github.com/larsrickert/discord-player-plus/commit/e2e1b5ad3036157e969adaa5b71ed0772b12a11a))
* **command:** queue command not using ephemeral ([cddd737](https://github.com/larsrickert/discord-player-plus/commit/cddd7378ec2aac669e69e1dad0b9bfcb2b3ca48c))
* **example:** use more user friendly ephemeral ([cf51239](https://github.com/larsrickert/discord-player-plus/commit/cf5123943d47262342f2d92fc6fef536fa8ff3d7))
* remove track url preview for `add` and `skip` command message ([a349c3f](https://github.com/larsrickert/discord-player-plus/commit/a349c3fde841387cc5362ab968dade51a3ba3531))
* **spotify:** playing wrong stream when artist is undefined ([bbb3da4](https://github.com/larsrickert/discord-player-plus/commit/bbb3da4ab4f4d794fb959e75042b103af1f02ff6))


### Features

* add player option `customEngines` ([ac411de](https://github.com/larsrickert/discord-player-plus/commit/ac411dee8f62bc2cc29b74c3bd43db7339679009))
* **engines:** add `isResponsible` method ([dc58e90](https://github.com/larsrickert/discord-player-plus/commit/dc58e90a16f0a9ab456a3f4fb2332d4090044021))


### BREAKING CHANGES

* remove player option `customSearch` and `customStream`  in favor of `customEngines`
* remove type `TrackSource`
* require engine prop `source`
* **engines:** remove exported function `detectTrackSource`
* **engines:** require method  `isResponsible` for engines

# [1.0.0-beta.2](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2022-05-24)


### Bug Fixes

* add missing export `handleSlashCommand` ([cd88723](https://github.com/larsrickert/discord-player-plus/commit/cd887237d42de5b41eff5203b6bf046f7bc22681))

# 1.0.0-beta.1 (2022-05-24)


### Bug Fixes

* `remove` not returning removed track ([9e7ab69](https://github.com/larsrickert/discord-player-plus/commit/9e7ab69f66c5703f00de56a70d746723d98ce04d))
* **player:** `add` playing track twice, `setPause` not returning `true` when already paused/resumed ([84a6a37](https://github.com/larsrickert/discord-player-plus/commit/84a6a370e0482aeb565dc195d0f15f5d06beae76))


### Code Refactoring

* **player-manager:** Add methods `find` and `remove` ([0458b8f](https://github.com/larsrickert/discord-player-plus/commit/0458b8f9dd7c3effcd332885a83cdf47701bfeb6))
* remove `SearchType` in favor of `TrackSource` ([32cb323](https://github.com/larsrickert/discord-player-plus/commit/32cb32320bf77ca168ab030ee867f1cac7cbde5f))
* rename event `disconnect` to `destroyed` ([2975507](https://github.com/larsrickert/discord-player-plus/commit/29755077c2e9ab6585af057390b0782f55656661))


### Features

* add `duration` and `artist` to track ([bc6cbcb](https://github.com/larsrickert/discord-player-plus/commit/bc6cbcb90342e6d10d2d3887b69e0a81de94b82b))
* add `fileRoot` player option ([ba5d6a2](https://github.com/larsrickert/discord-player-plus/commit/ba5d6a2bf7a57f20f199b1e4819e42e4a0e48ff1))
* add `insert` and `remove` method ([ed5e35b](https://github.com/larsrickert/discord-player-plus/commit/ed5e35b4c2b0cda731535b02e01dc1ef86b6dba8))
* add `queueEnd` event ([0873c42](https://github.com/larsrickert/discord-player-plus/commit/0873c4293459d9c449925f4135e19641f48a50f0))
* add `SearchType` search option ([c486936](https://github.com/larsrickert/discord-player-plus/commit/c486936dddafe290641c7c286e78c0b3cbbe465e))
* add `seek` method ([23a00e8](https://github.com/larsrickert/discord-player-plus/commit/23a00e8eecea5422a2f5f143edfa7b1cc601b4c8))
* add player ([8390eec](https://github.com/larsrickert/discord-player-plus/commit/8390eec1771185d708a8933d0fc04a2882b72bb4))
* add PlayerManager ([a1d8ed9](https://github.com/larsrickert/discord-player-plus/commit/a1d8ed905deea5ca0b76c0dbcbfc8492cb04768a))
* add pre-build slash commands ([ede5993](https://github.com/larsrickert/discord-player-plus/commit/ede59939bcbd304f3841b465c152810c1bf31346))
* add spotify player engine ([159477d](https://github.com/larsrickert/discord-player-plus/commit/159477dcc2593e254d4feae0254c605f7996bcc8))
* **player-manager:** add option deep merge ([b42ea27](https://github.com/larsrickert/discord-player-plus/commit/b42ea277955faead8da9382dcfd836e5fb424e46))
* support spotify playlists ([744fabd](https://github.com/larsrickert/discord-player-plus/commit/744fabdb6f0105dda4991d8fb5f327b835db5371))


### BREAKING CHANGES

* **player-manager:** remove method `exists` in favor of `find`
* remove `SearchType` in favor of `TrackSource`
* rename event `disconnect` to `destroyed`

# [1.0.0-alpha.4](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-05-24)


### Bug Fixes

* **player:** `add` playing track twice, `setPause` not returning `true` when already paused/resumed ([84a6a37](https://github.com/larsrickert/discord-player-plus/commit/84a6a370e0482aeb565dc195d0f15f5d06beae76))


### Code Refactoring

* **player-manager:** Add methods `find` and `remove` ([0458b8f](https://github.com/larsrickert/discord-player-plus/commit/0458b8f9dd7c3effcd332885a83cdf47701bfeb6))


### Features

* add pre-build slash commands ([ede5993](https://github.com/larsrickert/discord-player-plus/commit/ede59939bcbd304f3841b465c152810c1bf31346))
* **player-manager:** add option deep merge ([b42ea27](https://github.com/larsrickert/discord-player-plus/commit/b42ea277955faead8da9382dcfd836e5fb424e46))


### BREAKING CHANGES

* **player-manager:** remove method `exists` in favor of `find`

# [1.0.0-alpha.3](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2022-05-23)


### Features

* add `fileRoot` player option ([ba5d6a2](https://github.com/larsrickert/discord-player-plus/commit/ba5d6a2bf7a57f20f199b1e4819e42e4a0e48ff1))

# [1.0.0-alpha.2](https://github.com/larsrickert/discord-player-plus/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2022-05-23)


### Code Refactoring

* remove `SearchType` in favor of `TrackSource` ([32cb323](https://github.com/larsrickert/discord-player-plus/commit/32cb32320bf77ca168ab030ee867f1cac7cbde5f))


### Features

* add spotify player engine ([159477d](https://github.com/larsrickert/discord-player-plus/commit/159477dcc2593e254d4feae0254c605f7996bcc8))
* support spotify playlists ([744fabd](https://github.com/larsrickert/discord-player-plus/commit/744fabdb6f0105dda4991d8fb5f327b835db5371))


### BREAKING CHANGES

* remove `SearchType` in favor of `TrackSource`

# 1.0.0-alpha.1 (2022-05-06)


### Bug Fixes

* `remove` not returning removed track ([9e7ab69](https://github.com/larsrickert/discord-player-plus/commit/9e7ab69f66c5703f00de56a70d746723d98ce04d))


### Code Refactoring

* rename event `disconnect` to `destroyed` ([2975507](https://github.com/larsrickert/discord-player-plus/commit/29755077c2e9ab6585af057390b0782f55656661))


### Features

* add `duration` and `artist` to track ([bc6cbcb](https://github.com/larsrickert/discord-player-plus/commit/bc6cbcb90342e6d10d2d3887b69e0a81de94b82b))
* add `insert` and `remove` method ([ed5e35b](https://github.com/larsrickert/discord-player-plus/commit/ed5e35b4c2b0cda731535b02e01dc1ef86b6dba8))
* add `queueEnd` event ([0873c42](https://github.com/larsrickert/discord-player-plus/commit/0873c4293459d9c449925f4135e19641f48a50f0))
* add `SearchType` search option ([c486936](https://github.com/larsrickert/discord-player-plus/commit/c486936dddafe290641c7c286e78c0b3cbbe465e))
* add `seek` method ([23a00e8](https://github.com/larsrickert/discord-player-plus/commit/23a00e8eecea5422a2f5f143edfa7b1cc601b4c8))
* add player ([8390eec](https://github.com/larsrickert/discord-player-plus/commit/8390eec1771185d708a8933d0fc04a2882b72bb4))
* add PlayerManager ([a1d8ed9](https://github.com/larsrickert/discord-player-plus/commit/a1d8ed905deea5ca0b76c0dbcbfc8492cb04768a))


### BREAKING CHANGES

* rename event `disconnect` to `destroyed`
