import { Socket } from "socket.io";
import { getStream } from "../../utils/getStream.js";

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
    skt.on(
        "connectFileTreeTerminal",
        async ({ fileTreeTerminalId, containerId }) => {
            try {
                console.log({ fileTreeTerminalId });

                const stream = await getStream(containerId, fileTreeTerminalId);

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
        }
    );
};
