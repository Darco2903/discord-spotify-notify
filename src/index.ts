import { logError, logInfo } from "./logger.js";
import ClientWrapper from "./wrapper.js";
import { main } from "./spotify/index.js";

let wrapper: ClientWrapper<true>;

new ClientWrapper()
    .start()
    .then(async (wr) => {
        wrapper = wr;
        logInfo("Logged in as", wrapper.user.tag.cyan);
        await main(wrapper);
    })
    .catch((error) => {
        logError("Error starting the client:", error);
        process.exit(1);
    });

process.on("SIGINT", async () => {
    if (wrapper) {
        await wrapper.stop();
    }
    process.exit(0);
});
