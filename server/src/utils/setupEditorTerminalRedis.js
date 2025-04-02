import { redis, subscriber } from "../redis/redis.js";

export async function setupEditorTerminalRedis(stream, terminalId) {
    stream.on("data", async (chunk) => {
        if (chunk.length > 8) {
            chunk = chunk.slice(8).toString(); // Skip first 8 bytes
        }

        const filePath = await redis.LPOP(terminalId);
        const data = chunk.toString();
        const dataAndFilePathObj = JSON.stringify({ data, filePath });

        console.log({ dataAndFilePathObj });

        await redis.publish(
            terminalId + ":output:readFile",
            dataAndFilePathObj
        );
    });
    await subscriber.subscribe(
        terminalId + ":input:readFile",
        (inputAndFilePathObj) => {
            console.log({ inputAndFilePathObj });

            const { input, filePath } = JSON.parse(inputAndFilePathObj);
            redis.LPUSH(terminalId, filePath);
            stream.write(input + "\n");
        }
    );
    await subscriber.subscribe(terminalId + ":input:writeFile", (input) => {
        console.log(input);
        stream.write(input + "\n");
    });
}
