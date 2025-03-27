import { Socket } from "socket.io";
import { docker } from "../main.js";

/**
 * Description
 *
 * @function
 * @name connectTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */
export const connectTerminal = (skt) => {
    skt.on("connectTerminal", async ({ execId }) => {
        try {
            const exec = docker.getExec(execId);
            const stream = await exec.start({ hijack: true, stdin: true });

            skt.on("connectTerminal -i1", ({ input }) => {
                stream.write(input + "\n");
                setTimeout(() => {
                    stream.write("pwd\n");
                }, 100);
            });
            stream.on("data", (chunk) => {
                const data = chunk.toString();
                skt.emit("connectTerminal -o1", { data }); // Send output immediately
            });
            stream.write("pwd\n");

        } catch ({message}) {
            console.error({message})
        }
    });
};
