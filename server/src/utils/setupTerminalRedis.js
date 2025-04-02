import { redis, subscriber } from "../redis/redis.js";

export async function setupTerminalRedis(stream, terminalId) {
    stream.on("data", async (chunk) => {
        const data = chunk.toString();
        await redis.publish(terminalId + ":output", data);
    });
    await subscriber.subscribe(terminalId + ":input", (input) => {
        stream.write(input + "\n");
    });
}
