import { Socket } from "socket.io";
import { getStream } from "../../utils/getStream.js";
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
    skt.on("connectMainTerminal", async ({ mainTerminalId, containerId }) => {
        try {
            console.log({ mainTerminalId });

            const stream = await getStream(containerId, mainTerminalId);

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
