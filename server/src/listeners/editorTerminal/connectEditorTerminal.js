import { Socket } from "socket.io";
import { docker } from "../../main.js";
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
    skt.on("connectEditorTerminal", async ({ execId }) => {
        try {
            const exec = docker.getExec(execId);
            const stream = await exec.start({ hijack: true, stdin: true });

            skt.on("connectEditorTerminal -i1", ({ input }) => {
                stream.write(input + "\n");
            });
            stream.on("data", (chunk) => {
                const data = chunk.toString();
                skt.emit("connectEditorTerminal -o1", { data }); // Send output immediately
            });

        } catch ({message}) {
            console.error({message})
        }
    });
};
