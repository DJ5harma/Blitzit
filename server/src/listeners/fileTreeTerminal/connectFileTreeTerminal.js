import { Socket } from "socket.io";
import { redis, subscriber } from "../../redis/redis.js";

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
        async ({ fileTreeTerminalId }, callback) => {
            try {
                // console.log({ fileTreeTerminalId });

                skt.on("connectFileTreeTerminal -i1", async ({ input }) => {
                    await redis.publish(fileTreeTerminalId + ":input", input);
                });

                await subscriber.subscribe(
                    fileTreeTerminalId + ":output",
                    (data) => {
                        data = data.substring(data.indexOf("/"));
                        console.log({ data });
                        skt.emit("connectFileTreeTerminal -o1", { data });
                    }
                );

                callback();
            } catch ({ message }) {
                console.error({ message });
            }
        }
    );
};
