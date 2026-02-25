# Spotify Notify

<!-- Simple Discord Bot which send notification when tracks are added to a playlist -->

A Discord bot that watches specified Spotify playlists and sends notifications to designated Discord channels when new tracks are added. The bot can be configured to check for updates at regular intervals and can also manage a cache to optimize performance. It uses the [**Spotify Web API**](https://developer.spotify.com/documentation/web-api/) to fetch playlist data and the [**Discord API**](https://discord.com/developers/docs/intro) to send notifications.

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
        "checkInterval": 600,
        "idleTimes": 3
    }
}
```

> **playlists[x].enabled** is an optional boolean that determines whether the bot will check this playlist. (defaults to true)

> **checkInterval** is the time in seconds between each check.

> **idleTimes** is the number of consecutive checks without new tracks before the bot notifies that the playlist has been updated (useful when tracks are added regularly to avoid spamming the channel).
