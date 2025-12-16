import { API_ORIGIN, apiFetch } from "./core.js";
import type { PlaylistLight, PlaylistTracks, TrackLight, User } from "./types/index.js";
import { playlistToPlaylistLight, trackToTrackLight } from "./utils.js";

const LIMIT = 50;

type PlaylistTrackProgress = {
    current: number;
    total: number;
};

export async function fetchPlaylist(playlistId: string): Promise<PlaylistLight> {
    return apiFetch(`/playlists/${playlistId}`).then(playlistToPlaylistLight);
}

// export async function fetchPlaylistTracks(playlistId: string, offset: number, limit: number): Promise<PlaylistTracks> {
//     return apiFetch(`/playlists/${playlistId}/tracks?offset=${Math.max(offset, 0)}&limit=${Math.min(limit, LIMIT)}&locale=*`);
// }

export async function fetchPlaylistTracksFull(
    playlist: PlaylistLight,
    progressCallback: (progress: PlaylistTrackProgress) => void = () => {}
): Promise<TrackLight[]> {
    let res: PlaylistTracks;
    let url: string | null = `/playlists/${playlist.id}/tracks?limit=${LIMIT}&locale=*`;
    let list: TrackLight[] = [];

    const numberOfFetches = Math.ceil(playlist.tracks.total / LIMIT);

    let i = 0;
    do {
        i++;
        // console.log(`[${++i}] Fetching playlist tracks from ${url}`);
        res = await apiFetch(url);
        url = res.next?.replace(API_ORIGIN, "") || null;
        list.push(...res.items.map(trackToTrackLight));
        progressCallback({
            current: i,
            total: numberOfFetches,
        });
    } while (url);

    return list;
}

export async function fetchUser(userId: string): Promise<User> {
    return apiFetch(`/users/${userId}`);
}
