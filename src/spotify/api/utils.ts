import { Playlist, PlaylistLight, Track, TrackLight } from "./types/index.js";

export function trackToTrackLight(track: Track): TrackLight {
    return {
        added_at: track.added_at,
        added_by: track.added_by,
        track: {
            id: track.track.id,
            album: {
                images: track.track.album.images,
            },
            external_urls: track.track.external_urls,
            duration_ms: track.track.duration_ms,
            name: track.track.name,
            artists: track.track.artists,
        },
    };
}

export function playlistToPlaylistLight(playlist: Playlist): PlaylistLight {
    return {
        name: playlist.name,
        description: playlist.description,
        external_urls: playlist.external_urls,
        id: playlist.id,
        images: playlist.images,
        tracks: {
            total: playlist.tracks.total,
        },
        snapshot_id: playlist.snapshot_id,
    };
}
