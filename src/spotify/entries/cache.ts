import { CacheEntry } from "./CacheEntry.js";
import type { PlaylistLight } from "../api/types/index.js";
import { fetchPlaylistTracksFull } from "../api/endpoints.js";
import { logNewLine, logStart } from "../../logger.js";
import { wait } from "../../utils.js";

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

    async set(channelID: string, playlist: PlaylistLight): Promise<CacheEntry> {
        logStart(`Fetching tracks:`.cyan);
        const tracks = await fetchPlaylistTracksFull(playlist, (progress) => {
            process.stdout.cursorTo(22); // Move cursor after "[dd/mm/yyyy hh:mm:ss] "
            process.stdout.write(
                `${"Fetching tracks:".cyan} ${progress.current.toString().padStart(progress.total.toString().length, "0").green}/${
                    progress.total.toString().yellow
                }`
            );
        }).finally(logNewLine);

        const entry = new CacheEntry(channelID, playlist, tracks);
        this.cache.set(playlist.id, entry);
        // console.log("number of entries in cache:", this.cache.size);
        return entry;
    }

    async update(playlist: PlaylistLight): Promise<CacheEntry | undefined> {
        logStart(`Fetching tracks:`.cyan);
        const tracks = await fetchPlaylistTracksFull(playlist, (progress) => {
            process.stdout.cursorTo(22); // Move cursor after "[dd/mm/yyyy hh:mm:ss] "
            process.stdout.write(
                `${"Fetching tracks:".cyan} ${progress.current.toString().padStart(progress.total.toString().length, "0").green}/${
                    progress.total.toString().yellow
                }`
            );
        }).finally(logNewLine);

        const entry = this.cache.get(playlist.id);
        // console.log("cache found:", !!entry);
        entry?.update(playlist, tracks);
        return entry;
    }

    // async updateLazy(playlistID: string, playlist: PlaylistLight): Promise<CacheEntry | undefined> {
    //     let tracks: TrackLight[] = [];
    //     const entry = this.cache.get(playlistID);

    //     if (entry) {
    //         const cacheTracks = entry.getTracks();
    //         let i = 0;
    //         let index = playlist.tracks.total;

    //         while (index > 0) {
    //             const limit = Math.min(50, index);
    //             index -= limit;
    //             const r = await fetchPlaylistTracks(playlistID, index, limit);
    //             const tr = r.items.map(trackToTrackLight);

    //             let stop = false;
    //             for (i = tr.length - 1; i >= 0; i--) {
    //                 // Check if track already exists in cache at the same position from the end
    //                 const existingTrack = cacheTracks[index + i];
    //                 if (existingTrack && existingTrack.track.id === tr[i].track.id) {
    //                     console.log(`No more new tracks found at index ${index + i}. Stopping update.`);
    //                     stop = true;
    //                     break;
    //                 }
    //             }

    //             if (stop) {
    //                 tracks = r.items
    //                     .slice(i + 1) // Only take new tracks
    //                     .map(trackToTrackLight)
    //                     .concat(tracks); // Prepend new tracks
    //                 break;
    //             } else {
    //                 tracks = r.items.map(trackToTrackLight).concat(tracks);
    //             }
    //         }

    //         // console.log("cache found:", !!entry);
    //         const newTracks = cacheTracks.slice(0, index + i + 1).concat(tracks);
    //         console.log(`Updating cache entry for playlist ${playlistID} with ${newTracks.length} total tracks.`);
    //         entry.update(playlist, newTracks);
    //     }
    //     return entry;
    // }

    // async saveAll(): Promise<void> {
    //     const entries = Array.from(this.cache.values());
    //     console.log(`Saving ${entries.length} cache entries...`);
    //     await Promise.all(entries.map(async (entry) => entry.save()));
    //     console.log("All cache entries saved.");
    // }
}
