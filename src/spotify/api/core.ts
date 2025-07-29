import config from "../../../config.json" with { type: "json" };

export const API_ORIGIN = "https://api.spotify.com/v1";

let token = "";

async function fetchToken(): Promise<string> {
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
    const data = await response.json();
    // log("Token fetched:", data);
    return data.access_token;
}

export async function apitFetch(endpoint: string): Promise<any> {
    if (!token) {
        token = await fetchToken();
    }

    const response = await fetch(API_ORIGIN + endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}
