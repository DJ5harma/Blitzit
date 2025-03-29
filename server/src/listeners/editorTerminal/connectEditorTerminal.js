import { Socket } from "socket.io";
import { terminalId_to_stream } from "../createContainer.js";
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
            console.log({ editorTerminalId });
            const stream = terminalId_to_stream[editorTerminalId];

            if (!stream) throw new Error("Stream map was vanished");

            skt.on("connectEditorTerminal -i1", ({ input }) => {
                console.log({ input });
                stream.write(input + "\n");
            });
            stream.on("data", (chunk) => {
                const data = chunk.toString();
                skt.emit("connectEditorTerminal -o1", { data }); // Send output immediately
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
