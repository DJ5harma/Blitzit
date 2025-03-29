import { Socket } from "socket.io";
import { docker } from "../../main.js";

/**
 * Description
 *
 * @function
 * @name createFileTreeTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createFileTreeTerminal = (skt) => {
    skt.on("createFileTreeTerminal", async ({ containerId }) => {
        try {
            const container = docker.getContainer(containerId);
            const exec = await container.exec({
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                // Tty: true,
                Cmd: ["/bin/sh"],
            });

            skt.emit("createFileTreeTerminal -o1", { execId: exec.id });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
