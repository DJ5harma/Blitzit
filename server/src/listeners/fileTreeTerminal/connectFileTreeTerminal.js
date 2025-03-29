import { Socket } from "socket.io";
import { docker } from "../../main.js";

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
    skt.on("connectFileTreeTerminal", async ({ execId }) => {
        try {
            const exec = docker.getExec(execId);
            const stream = await exec.start({ hijack: true, stdin: true });

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
