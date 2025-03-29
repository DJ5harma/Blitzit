import { Socket } from "socket.io";
import { redis, subscriber } from "../../redis/redis.js";
/**
 * Description
 *
 * @function
 * @name connectEditorTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */
export const connectEditorTerminal = (skt) => {
    skt.on("connectEditorTerminal", async ({ editorTerminalId }) => {
        try {
            // console.log({ editorTerminalId });

            skt.on(
                "connectEditorTerminal -i1", // read file
                async ({ input, filePath }) => {
                    if (!filePath) return;
                    const inputAndFilePathObj = JSON.stringify({
                        input,
                        filePath,
                    });
                    await redis.publish(
                        editorTerminalId + ":input:readFile",
                        inputAndFilePathObj
                    );
                }
            );

            await subscriber.subscribe(
                editorTerminalId + ":output:readFile",
                (dataAndFilePathObj) => {
                    const { data, filePath } = JSON.parse(dataAndFilePathObj);
                    const editedData = data.substr(data.indexOf(")") + 1);
                    skt.emit("connectEditorTerminal -o1", {
                        data: editedData,
                        filePath,
                    });
                }
            );

            // const stream = await getStream(containerId, editorTerminalId);

            // skt.on("connectEditorTerminal -i1", ({ input }, callback) => {
            //     console.log({ input });
            //     stream.write(input + "\n");

            //     stream.once("data", (chunk) => {
            //         let data = chunk.toString();
            //         data = data.substr(data.indexOf(")") + 1);
            //         callback({ data });
            //     });
            // });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
