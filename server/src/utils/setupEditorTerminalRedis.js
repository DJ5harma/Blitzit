import { redis, subscriber } from "../redis/redis.js";

export async function setupEditorTerminalRedis(stream, terminalId) {
    stream.on("data", async (chunk) => {
        const filePath = await redis.LPOP(terminalId);
        const data = chunk.toString();
        const dataAndFilePathObj = JSON.stringify({ data, filePath });
        await redis.publish(
            terminalId + ":output:readFile",
            dataAndFilePathObj
        );
    });
    await subscriber.subscribe(
        terminalId + ":input:readFile",
        (inputAndFilePathObj) => {
            const { input, filePath } = JSON.parse(inputAndFilePathObj);
            redis.RPUSH(terminalId, filePath);
            stream.write(input + "\n");
        }
    );
}
