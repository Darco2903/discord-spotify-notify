import type { Track } from "./Track.js";

export type PlaylistTracks = {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Track[];
};
