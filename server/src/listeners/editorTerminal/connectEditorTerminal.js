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
    skt.on("connectEditorTerminal", async ({ editorTerminalId }, callback) => {
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
                    // const editedData = data.substr(data.indexOf(")") + 1);
                    skt.emit("connectEditorTerminal -o1", {
                        data,
                        filePath,
                    });
                }
            );

            skt.on(
                "connectEditorTerminal -i2", // read file
                async ({ input }) => {
                    await redis.publish(
                        editorTerminalId + ":input:writeFile",
                        input
                    );
                }
            );
            callback();
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
