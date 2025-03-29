import { Socket } from "socket.io";
import { terminalId_to_stream } from "../createContainer.js";

/**
 * Description
 *
 * @function
 * @name connectMainTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */
export const connectMainTerminal = (skt) => {
    skt.on("connectMainTerminal", async ({ mainTerminalId }) => {
        try {
            console.log({ mainTerminalId });
            const stream = terminalId_to_stream[mainTerminalId];
            if (!stream) throw new Error("Stream map was vanished");

            skt.on("connectMainTerminal -i1", ({ input }) => {
                console.log({ input });

                stream.write(input + "\n");
            });
            stream.on("data", (chunk) => {
                const data = chunk.toString();
                skt.emit("connectMainTerminal -o1", { data });
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
