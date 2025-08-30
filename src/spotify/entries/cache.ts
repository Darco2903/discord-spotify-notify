import { CacheEntry } from "./CacheEntry.js";
import type { PlaylistLight } from "../api/types/Playlist.js";
import { fetchPlaylistTracksFull } from "../api/endpoints.js";

export class Cache {
    protected cache: Map<string, CacheEntry>;

    constructor() {
        this.cache = new Map();
    }

    async load(channelID: string, playlistID: string): Promise<boolean> {
        const entry = await CacheEntry.loadFromFile(channelID, playlistID);
        // console.log("CacheEntry loaded:", !!entry);
        if (entry) {
            this.cache.set(playlistID, entry);
            return true;
        }
        return false;
    }

    get(playlistID: string): CacheEntry | undefined {
        return this.cache.get(playlistID);
    }

    async set(channelID: string, playlistID: string, playlist: PlaylistLight): Promise<CacheEntry> {
        // console.log(`Setting cache for playlist ${playlistID} in channel ${channelID}`);
        const tracks = await fetchPlaylistTracksFull(playlistID);
        const entry = new CacheEntry(channelID, playlist, tracks);
        this.cache.set(playlistID, entry);
        // console.log("number of entries in cache:", this.cache.size);
        return entry;
    }

    async update(playlistID: string, playlist: PlaylistLight): Promise<CacheEntry | undefined> {
        const tracks = await fetchPlaylistTracksFull(playlistID);
        const entry = this.cache.get(playlistID);
        // console.log("cache found:", !!entry);
        entry?.update(playlist, tracks);
        return entry;
    }

    // async saveAll(): Promise<void> {
    //     const entries = Array.from(this.cache.values());
    //     console.log(`Saving ${entries.length} cache entries...`);
    //     await Promise.all(entries.map(async (entry) => entry.save()));
    //     console.log("All cache entries saved.");
    // }
}
