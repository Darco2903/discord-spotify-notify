import "colors";

function format(...args: string[]): string {
    return `[${new Date().toLocaleString("fr-FR")}] ${args.join(" ")}`;
}

export function log(...args: string[]): void {
    process.stdout.write(`${args.join(" ")}`);
}

export function logStart(...args: string[]): void {
    process.stdout.write(`${format(...args)}`);
}

export function logError(...args: string[]): void {
    process.stderr.write(`${format(...args).red}\n`);
}

export function logWarning(...args: string[]): void {
    process.stderr.write(`${format(...args).yellow}\n`);
}

export function logInfo(...args: string[]): void {
    process.stdout.write(`${format(...args)}\n`);
}