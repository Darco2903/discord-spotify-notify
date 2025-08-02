export type Track = {
    added_at: string;
    added_by: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        type: "user";
        uri: string;
    };
    is_local: false;
    track: {
        album: {
            album_type: "compilation";
            total_tracks: number
            available_markets: ["CA", "BR", "IT"];
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
            release_date: "1981-12";
            release_date_precision: "year";
            restrictions: {
                reason: "market";
            };
            type: "album";
            uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ";
            artists: [
                {
                    external_urls: {
                        spotify: string;
                    };
                    href: string;
                    id: string;
                    name: string;
                    type: "artist";
                    uri: string;
                }
            ];
        };
        artists: [
            {
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: "artist";
                uri: string;
            }
        ];
        available_markets: [string];
        disc_number: number;
        duration_ms: number;
        explicit: false;
        external_ids: {
            isrc: string;
            ean: string;
            upc: string;
        };
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        is_playable: false;
        linked_from: {};
        restrictions: {
            reason: string;
        };
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: "track";
        uri: string;
        is_local: false;
    };
};