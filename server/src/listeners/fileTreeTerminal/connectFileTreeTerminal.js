import { Socket } from "socket.io";
import { terminalId_to_stream } from "../createContainer.js";

/**
 * Description
 *
 * @function
 * @name connectFileTreeTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */
export const connectFileTreeTerminal = (skt) => {
    skt.on("connectFileTreeTerminal", async ({ fileTreeTerminalId }) => {
        try {
            console.log({ fileTreeTerminalId });

            const stream = terminalId_to_stream[fileTreeTerminalId];
            if (!stream) throw new Error("Stream map was vanished");


            skt.on("connectFileTreeTerminal -i1", ({ input }) => {
                stream.write(input + "\n");
            });
            stream.on("data", (chunk) => {
                const data = chunk.toString();
                skt.emit("connectFileTreeTerminal -o1", { data }); // Send output immediately
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
