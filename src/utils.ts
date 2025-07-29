import fs from "fs";

export function createLink(text: string, url: string): string {
    return `[${text}](${url})`;
}

export async function exists(path: string): Promise<boolean> {
    return fs.promises
        .access(path)
        .then(() => true)
        .catch(() => false);
}

function parseTime(time: number): { h: number; m: number; s: number } {
    return {
        h: ~~(time / 3600),
        m: ~~((time % 3600) / 60),
        s: ~~(time % 60),
    };
}

export function formatTime(time: number): string {
    const { h, m, s } = parseTime(time);
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
