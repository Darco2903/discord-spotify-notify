import fs from "fs";
import path from "path";
import { exists } from "../../utils.js";
import type { Playlist, Track } from "../api/types";

import config from "../../../config.json" with { type: "json" };

export class CacheEntry {
    protected channelID: string;
    protected playlist: Playlist;
    protected lastPlaylist: Playlist;
    protected tracks: Track[];
    protected lastTracks: Track[];
    protected lastSnapshotId: string;
    protected snapshotIdle: number;

    static getFilePath(playlistID: string): string {
        return path.join(config.cache.path, `${playlistID}.json`);
    }

    static async loadFromFile(channelID: string, playlistID: string): Promise<CacheEntry | null> {
        const filePath = CacheEntry.getFilePath(playlistID);
        let entry = null;
        if (await exists(filePath)) {
            const data = await fs.promises.readFile(filePath, "utf-8");
            const parsed = JSON.parse(data);
            entry = new CacheEntry(channelID, parsed.playlist, parsed.tracks);
        }
        return entry;
    }

    constructor(channelID: string, playlist: Playlist, tracks: Track[]) {
        this.channelID = channelID;
        this.playlist = playlist;
        this.lastPlaylist = playlist;
        this.tracks = tracks;
        this.lastTracks = tracks;
        this.lastSnapshotId = playlist.snapshot_id;
        this.snapshotIdle = -1;
    }

    update(playlist: Playlist, tracks: Track[]): void {
        this.lastPlaylist = this.playlist;
        this.playlist = playlist;
        this.lastTracks = this.tracks;
        this.tracks = tracks;
        this.lastSnapshotId = playlist.snapshot_id;
        this.snapshotIdle = -1;
    }

    getId(): string {
        return this.playlist.id;
    }

    getPlaylist(): Playlist {
        return this.playlist;
    }

    getTracks(): Track[] {
        return this.tracks;
    }

    getName(): string {
        return this.playlist.name;
    }

    getTrackCount(): number {
        return this.playlist.tracks.total;
    }

    getLastTrackCount(): number {
        return this.lastPlaylist.tracks.total;
    }

    getSnapshotId(): string {
        return this.playlist.snapshot_id;
    }

    async save(): Promise<void> {
        // console.log(`Saving cache entry for playlist ${this.getId()}`);
        const data = JSON.stringify({
            playlist: this.playlist,
            tracks: this.tracks,
        });
        const filePath = CacheEntry.getFilePath(this.getId());
        // console.log(`Saving cache entry for playlist ${this.getId()} to ${filePath}`);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, data);
    }

    checkDiff(): [Track, number][] {
        const diff: [Track, number][] = [];
        const lastTrackIds = new Set(this.lastTracks.map((track) => track.track.id));
        for (let i = 0; i < this.tracks.length; i++) {
            const track = this.tracks[i];
            if (!lastTrackIds.has(track.track.id)) {
                diff.push([track, i]);
            }
        }
        return diff;
    }

    checkSnapshotIdle(lastSnapshotId: string): number {
        if (this.lastSnapshotId === lastSnapshotId) {
            // console.log("snapshot idling");
            if (this.snapshotIdle > 0) {
                this.snapshotIdle--;
            } else if (this.snapshotIdle === 0) {
                this.snapshotIdle = -1; // Reset idle state
            }
        } else {
            // console.log("snapshot changed, resetting idle");
            this.lastSnapshotId = lastSnapshotId;
            this.snapshotIdle = config.spotify.idleTimes;
        }
        // console.log(`Current snapshot idle: ${this.snapshotIdle}`);
        return this.snapshotIdle;
    }
}
