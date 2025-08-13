# discord-spotify-notify

Simple Discord Bot which send notification when tracks are added to a playlist

## Installation

```bash
pnpm i
pnpm build
```

## Configuration

```json
{
    "cache": {
        "path": "PATH_TO_CACHE_DIR"
    },
    "discord": {
        "clientID": "DISCORD_CLIENT_ID",
        "token": "DISCORD_BOT_TOKEN"
    },
    "spotify": {
        "clientID": "SPOTIFY_CLIENT_ID",
        "clientSecret": "SPOTIFY_CLIENT_SECRET",
        "playlists": [
            {
                "name": "playlist1",
                "enabled": true,
                "playlistID": "SPOTIFY_PLAYLIST_ID",
                "channelID": "DISCORD_CHANNEL_ID",
                "roleID": "DISCORD_ROLE_ID"
            }
        ],
        "checkInterval": 30,
        "idleTimes": 2
    }
}
```

> **enabled** is an optional boolean that determines whether the bot will check this playlist. (defaults to true)

> **checkInterval** is the time in seconds between each check.

> **idleTimes** is the number of consecutive checks without new tracks before the bot notifies that the playlist has been updated.
