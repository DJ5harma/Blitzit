import { Socket } from "socket.io";
import { docker } from "../main.js";

const images = ["python-template"];
/**
 * Description
 *
 * @function
 * @name createContainer
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createContainer = (skt) => {
    skt.on("createContainer", async ({ Image }) => {
        try {
            if (!images.includes(Image)) return;

            const container = await docker.createContainer({
                Image,
                Tty: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                OpenStdin: true,
                StdinOnce: false,
                Cmd: ["/bin/sh"],
            });

            await container.start();
            console.log("Container created");
            const containerId = container.id;

            skt.emit("createContainer -o1", { containerId });

            // skt.on("disconnect", async () => {
            //     await container.stop();
            //     await container.remove();
            //     console.log("Container destroyed on cliet disconnection");
            // });
        } catch ({message}) {console.error({message})}
    });
};
