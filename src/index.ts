import ClientWrapper from "./client.js";
import { main } from "./spotify/index.js";
import { logError, logInfo } from "./logger.js";

const wrapper = new ClientWrapper();

wrapper.start().then(async (client) => {
    logInfo("Logged in as", client.user.tag.cyan);
    await main(client);
}).catch((error) => {
    logError("Error starting the client:", error);
    process.exit(1);
});

process.on("SIGINT", async () => {
    await wrapper.stop();
    process.exit(0);
});
