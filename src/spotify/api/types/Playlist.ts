import type { TrackLight } from "./Track.js";

export type PlaylistLight = {
    name: string;
    description: string;
    external_urls: {
        spotify: string;
    };
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    tracks: {
        total: number;
    };
    snapshot_id: string;
};

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
        items: TrackLight[];
    };
    type: string;
    uri: string;
};
