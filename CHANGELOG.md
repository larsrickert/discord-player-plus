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
