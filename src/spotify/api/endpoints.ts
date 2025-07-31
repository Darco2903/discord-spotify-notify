import { API_ORIGIN, apiFetch } from "./core.js";
import type { Playlist, PlaylistTracks, Track, User } from "./types";

const LIMIT = 50;

export async function fetchPlaylist(playlistId: string): Promise<Playlist> {
    return apiFetch(`/playlists/${playlistId}`);
}

export async function fetchPlaylistTracks(playlistId: string, offset: number, limit: number): Promise<PlaylistTracks> {
    return apiFetch(`/playlists/${playlistId}/tracks?offset=${Math.max(offset, 0)}&limit=${Math.min(limit, LIMIT)}`);
}

export async function fetchPlaylistTracksFull(playlistId: string): Promise<Track[]> {
    let res: PlaylistTracks;
    let url = `/playlists/${playlistId}/tracks?limit=${LIMIT}&locale=*`;
    let list: Track[] = [];

    do {
        res = await apiFetch(url);
        url = res.next?.replace(API_ORIGIN, "");
        list.push(...res.items);
    } while (url);

    return list;
}

export async function fetchUser(userId: string): Promise<User> {
    return apiFetch(`/users/${userId}`);
}