import { Socket } from "socket.io";
import { getStream } from "../../utils/getStream.js";
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
    skt.on(
        "connectEditorTerminal",
        async ({ editorTerminalId, containerId }) => {
            try {
                console.log({ editorTerminalId });

                const stream = await getStream(containerId, editorTerminalId);

                skt.on("connectEditorTerminal -i1", ({ input }, callback) => {
                    console.log({ input });
                    stream.write(input + "\n");

                    stream.once("data", (chunk) => {
                        let data = chunk.toString();
                        data = data.substr(data.indexOf(")") + 1);
                        callback({ data });
                    });
                });
                stream.on("data", (chunk) => {
                    const data = chunk.toString();
                    skt.emit("connectEditorTerminal -o1", { data }); // Send output immediately
                });
            } catch ({ message }) {
                console.error({ message });
            }
        }
    );
};
