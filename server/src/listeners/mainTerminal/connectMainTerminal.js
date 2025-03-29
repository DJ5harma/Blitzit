import { Socket } from "socket.io";
import { docker } from "../../main.js";

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
    skt.on("connectMainTerminal", async ({ execId }) => {
        try {
            const exec = docker.getExec(execId);
            const stream = await exec.start({ hijack: true, stdin: true });

            skt.on("connectMainTerminal -i1", ({ input }) => {
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
