import { API_ORIGIN, apiFetch } from "./core.js";
import type { PlaylistLight, PlaylistTracks, Track, TrackLight, User } from "./types/index.js";
import { playlistToPlaylistLight, trackToTrackLight } from "./utils.js";

const LIMIT = 50;

export async function fetchPlaylist(playlistId: string): Promise<PlaylistLight> {
    return apiFetch(`/playlists/${playlistId}`).then(playlistToPlaylistLight);
}

export async function fetchPlaylistTracks(playlistId: string, offset: number, limit: number): Promise<PlaylistTracks> {
    return apiFetch(`/playlists/${playlistId}/tracks?offset=${Math.max(offset, 0)}&limit=${Math.min(limit, LIMIT)}`);
}

export async function fetchPlaylistTracksFull(playlistId: string): Promise<TrackLight[]> {
    let res: PlaylistTracks;
    let url = `/playlists/${playlistId}/tracks?limit=${LIMIT}&locale=*`;
    let list: TrackLight[] = [];

    // let i = 0;
    do {
        // console.log(`[${++i}] Fetching playlist tracks from ${url}`);
        res = await apiFetch(url);
        url = res.next?.replace(API_ORIGIN, "");
        list.push(...res.items.map(trackToTrackLight));
    } while (url);

    return list;
}

export async function fetchUser(userId: string): Promise<User> {
    return apiFetch(`/users/${userId}`);
}
