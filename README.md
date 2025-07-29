# discord-spotify-notify

Simple Discord Bot which send notification when a track is added to a playlist

## Installation

```bash
pnpm i -P
pnpm run build
```

## Configuration

```json
{
    "cache": {
        "path": "PATH_TO_CACHE_DIR"
    },
    "discord": {
        "clientID": "DISCORD_CLIENT_ID",
        "token": "DISCORD_BOT_TOKEN",
    },
    "spotify": {
        "clientID": "SPOTIFY_CLIENT_ID",
        "clientSecret": "SPOTIFY_CLIENT_SECRET",
        "playlists": [
            {
                "name": "playlist1",
                "playlistID": "SPOTIFY_PLAYLIST_ID",
                "channelID": "DISCORD_CHANNEL_ID",
                "roleID": "DISCORD_ROLE_ID"
            },
            ...
        ],
        "checkInterval": 30 // in seconds
    }
}
```
