import { Socket } from "socket.io";
import { docker } from "../../main.js";

/**
 * Description
 *
 * @function
 * @name createEditorTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createEditorTerminal = (skt) => {
    skt.on("createEditorTerminal", async ({ containerId }) => {
        try {
            const container = docker.getContainer(containerId);
            const exec = await container.exec({
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                // Tty: true,
                Cmd: ["/bin/sh"],
            });

            skt.emit("createEditorTerminal -o1", { execId: exec.id });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
