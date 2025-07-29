import { Client, Events, GatewayIntentBits } from "discord.js";
import { logInfo } from "./logger.js";

import config from "../config.json" with { type: "json" };

export default class ClientWrapper extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    async start(): Promise<Client<true>> {
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });
        client.login(config.discord.token);
        return new Promise<Client<true>>((resolve) => {
            client.once(Events.ClientReady, resolve);
        });
    }

    async stop(): Promise<void> {
        logInfo("Stopping the client...".magenta);
        this.user?.setStatus("invisible");
        await this.destroy();
    }
}
