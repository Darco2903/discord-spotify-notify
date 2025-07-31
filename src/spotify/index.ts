import { MessagePayload } from "discord.js";
import type { APIEmbed, SendableChannels } from "discord.js";
import ClientWrapper from "../wrapper.js";
import { log, logError, logInfo, logNewLine, logStart } from "../logger.js";
import { fetchPlaylist, fetchUser } from "./api/endpoints.js";
import { Cache } from "./cache/cache.js";
import { createLink, formatTime, wait } from "../utils.js";
import type { Playlist, Track, User } from "./api/types/";

import config from "../../config.json" with { type: "json" };

const cache = new Cache();
const INTERVAL = config.spotify.checkInterval * 1000; // Convert seconds to milliseconds

function getPlaylistConfig(playlistId: string) {
    return config.spotify.playlists.find((p) => p.playlistID === playlistId) || null;
}

function createEmbed(track: Track, position: number, user: User): APIEmbed {
    return {
        title: track.track.name,
        description: track.track.artists.map((artist) => createLink(artist.name, artist.external_urls.spotify)).join(" - "),
        author: {
            name: user.display_name,
            icon_url: user.images[0]?.url,
            url: user.external_urls.spotify,
        },
        fields: [
            {
                name: "Index",
                value: `#${position + 1}`,
                inline: true,
            },
            {
                name: "Duration",
                value: formatTime(track.track.duration_ms / 1000),
                inline: true,
            },
            {
                name: "Added At",
                value: `<t:${Math.floor(new Date(track.added_at).getTime() / 1000)}:R>`,
                inline: true,
            },
        ],
        url: track.track.external_urls.spotify,
        color: 0x1db954, // Spotify green
        image: {
            url: track.track.album.images[0].url,
        },
        provider: {
            name: "Spotify",
            url: "https://spotify.com",
        },
        timestamp: new Date(track.added_at).toISOString(),
    };
}

function createTrackMessage(channel: SendableChannels, tracks_chunk: [Track, number][], user: User[]): MessagePayload {
    return MessagePayload.create(channel, {
        embeds: tracks_chunk.map(([track, position], i) => createEmbed(track, position, user[i])),
    });
}

async function getUserWithCache(userId: string, cache: Map<string, User>): Promise<User> {
    let user = cache.get(userId);
    if (!user) {
        user = await fetchUser(userId);
        cache.set(userId, user);
    }
    return user;
}

async function createUserList(track_chunk: [Track, number][], userCache: Map<string, User>): Promise<User[]> {
    const users = [];
    for (const [track] of track_chunk) {
        const user = await getUserWithCache(track.added_by.id, userCache);
        users.push(user);
    }
    return users;
}

async function notifyTracks(channel: SendableChannels, track_chunk: [Track, number][], userCache: Map<string, User>) {
    const users = await createUserList(track_chunk, userCache);
    if (users.some((user) => !user)) {
        logError("One or more users not found.");
        return;
    }

    const message = createTrackMessage(channel, track_chunk, users);
    await channel.send(message);
    // logInfo(`Notification sent for playlist ${cached.getName()} (${playlistId})`);
}

function createNotificationMessage(playlist: Playlist, lastTrack: Track): APIEmbed {
    return {
        title: `**${playlist.name}**`,
        description: playlist.description || "*No description*",
        url: playlist.external_urls.spotify,
        image: {
            url: playlist.images[0]?.url || "https://dummyimage.com/400x400/000/fff.png",
        },
        color: 0x1db954, // Spotify green
        fields: [
            {
                name: "Total",
                value: playlist.tracks.total.toString(),
                inline: true,
            },
            {
                name: "Last Updated",
                value: `<t:${Math.floor(new Date(lastTrack.added_at).getTime() / 1000)}:R>`,
                inline: true,
            },
        ],
    };
}

async function notify(client: ClientWrapper<true>, playlistId: string, tracks: [Track, number][]) {
    const playlistConfig = getPlaylistConfig(playlistId);
    if (!playlistConfig) {
        logError(`Playlist configuration not found for ID: ${playlistId}`);
        return;
    }

    const entry = cache.get(playlistId);
    if (!entry) {
        logError(`No cached data found for playlist ID: ${playlistId}`);
        return;
    }

    const channel = client.channels.cache.get(playlistConfig.channelID);
    if (!channel?.isSendable()) {
        logError(`Channel ${playlistConfig.channelID} is not sendable or does not exist.`);
        return;
    }

    // logInfo(`Notifying about ${tracks.length} new tracks in playlist ${playlistId} (${playlistConfig.name})`);
    await channel.sendTyping();

    let mention = "";
    if (!channel.isDMBased()) {
        const role = channel.guild.roles.cache.get(playlistConfig.roleID);
        if (role) {
            mention = ` <@&${role.id}>`;
        }
    }

    const lastTrack = entry.getTracks()[entry.getTracks().length - 1];
    const notifMessage = createNotificationMessage(entry.getPlaylist(), lastTrack);
    await channel.send({
        content: `Content just dropped!${mention}`,
        embeds: [notifMessage],
    });

    const userCache = new Map<string, User>();
    const SPLIT = 10;
    for (let i = 0; i < tracks.length; i += SPLIT) {
        const chunk = tracks.slice(i, i + SPLIT);
        await notifyTracks(channel, chunk, userCache);
    }
}

function isSnapshotUpdated(playlist: Playlist): boolean {
    const entry = cache.get(playlist.id);
    return !!entry && playlist.snapshot_id !== entry.getSnapshotId();
}

async function updatePlaylist(client: ClientWrapper<true>, playlist: Playlist) {
    const entry = await cache.update(playlist.id, playlist);
    if (entry) {
        // check diffs
        const diff = entry.checkDiff();
        logInfo(`Found ${diff.length.toString().yellow} new tracks`);

        if (diff.length > 0) {
            await notify(client, playlist.id, diff);
        }
        await entry.save().catch(logError);
    }
}

async function checkForUpdates(client: ClientWrapper<true>) {
    // client.setBusy(true);
    logInfo("Starting snapshot check".green);
    for (const playlistConfig of config.spotify.playlists) {
        logStart(playlistConfig.playlistID.magenta);
        const playlist = await fetchPlaylist(playlistConfig.playlistID);
        log(` (${playlist.name})`.cyan);

        if (isSnapshotUpdated(playlist)) {
            log(" -> Snapshot changed, updating cache\n".yellow);
            await updatePlaylist(client, playlist);
        } else {
            log(" -> No snapshot change\n");
        }
    }
    logNewLine();
    // client.setBusy(false);
}

export async function main(client: ClientWrapper<true>) {
    // initializing the snapshot map with the current snapshot
    logInfo("Initializing Spotify cache".green);

    for (const { channelID, playlistID } of config.spotify.playlists) {
        logStart(playlistID.magenta);
        const playlist = await fetchPlaylist(playlistID);
        log(` (${playlist.name})`.cyan);

        if (await cache.load(channelID, playlistID)) {
            // CacheEntry found -> if snapshot changed -> update the cache
            if (isSnapshotUpdated(playlist)) {
                log(" -> Snapshot changed, updating cache\n".yellow);
                await updatePlaylist(client, playlist);
            } else {
                log(" -> No snapshot change\n");
            }
        } else {
            // CacheEntry not found
            log(" -> No cache entry found, creating new entry\n".yellow);
            const entry = await cache.set(channelID, playlistID, playlist);
            await entry.save().catch(logError);
        }
    }

    logInfo("Initialized successfully\n".green);

    while (true) {
        await wait(INTERVAL);
        await checkForUpdates(client); // Start the periodic check for updates
    }
}
