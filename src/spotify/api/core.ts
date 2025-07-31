import type { Token } from "./types";
import config from "../../../config.json" with { type: "json" };

export const API_ORIGIN = "https://api.spotify.com/v1";

let token: string | null = null;
let tokenExpiry: number | null = null;

async function fetchToken(): Promise<Token> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: config.spotify.clientID,
            client_secret: config.spotify.clientSecret,
        }),
    });
    const data: Token = await response.json();
    // console.log("Token fetched:", data);
    return data;
}

export async function apiFetch(endpoint: string): Promise<any> {
    if (!token || !tokenExpiry || Date.now() > tokenExpiry) {
        const t = await fetchToken();
        token = t.access_token;
        tokenExpiry = Date.now() + (t.expires_in - 60 * 1000); // Set expiry to 1 minute before actual expiry
    }

    const response = await fetch(API_ORIGIN + endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}
