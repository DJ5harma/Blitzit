import { Socket } from "socket.io";
import { redis, subscriber } from "../../redis/redis.js";
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
            // console.log({ mainTerminalId });

            skt.on("connectMainTerminal -i1", async ({ input }) => {
                await redis.publish(mainTerminalId + ":input", input);
            });

            await subscriber.subscribe(mainTerminalId + ":output", (data) => {
                skt.emit("connectMainTerminal -o1", { data });
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
