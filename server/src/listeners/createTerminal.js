import { Socket } from "socket.io";
import { docker } from "../main.js";
import { handle } from "../middleware/handle.js";

/**
 * Description
 *
 * @function
 * @name createTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createTerminal = (skt) => {
    skt.on("createTerminal", async ({ containerId }) => {
        try {
            const container = docker.getContainer(containerId);
            const exec = await container.exec({
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                // Tty: true,
                Cmd: ["/bin/sh"],
            });

            skt.emit("createTerminal -o1", { execId: exec.id });
        } catch ({message}) {
            console.error({message});
        }
    });
};
