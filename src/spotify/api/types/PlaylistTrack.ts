import type { Track } from "./Track.js";

export type PlaylistTracks = {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: Track[];
};
