import type { Track } from "./Track.js";

export type Playlist = {
    collaborative: false;
    description: string;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: [
        {
            url: string;
            height: number;
            width: number;
        }
    ];
    name: string;
    owner: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
        display_name: string;
    };
    public: false;
    snapshot_id: string;
    tracks: {
        href: string;
        limit: number;
        next: string;
        offset: number;
        previous: string;
        total: number;
        items: Track[];
    };
    type: string;
    uri: string;
};
