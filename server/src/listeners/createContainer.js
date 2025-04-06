import { Socket } from "socket.io";
import { docker } from "../main.js";
import { ROOM } from "../database/ROOM.js";
import { execConfig } from "../utils/execConfig.js";
import { streamConfig } from "../utils/streamConfig.js";
import { setupEditorTerminalRedis } from "../utils/setupEditorTerminalRedis.js";
import { setupTerminalRedis } from "../utils/setupTerminalRedis.js";

const images = ["python-template"];

export const terminalId_to_stream = {};

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
    skt.on("createContainer", async ({ Image, title }) => {
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

            const mainTerminalExec = await container.exec(execConfig);
            const fileTreeTerminalExec = await container.exec(execConfig);
            const editorTerminalExec = await container.exec(execConfig);

            const mainTerminalStream = await mainTerminalExec.start(
                streamConfig
            );
            const fileTreeTerminalStream = await fileTreeTerminalExec.start(
                streamConfig
            );
            const editorTerminalStream = await editorTerminalExec.start(
                streamConfig
            );

            const fileTreeTerminalId = fileTreeTerminalExec.id,
                editorTerminalId = editorTerminalExec.id,
                mainTerminalId = mainTerminalExec.id;

            await setupTerminalRedis(mainTerminalStream, mainTerminalId);
            await setupTerminalRedis(
                fileTreeTerminalStream,
                fileTreeTerminalId
            );
            await setupEditorTerminalRedis(
                editorTerminalStream,
                editorTerminalId
            );

            const newRoom = await ROOM.create({
                containerId,
                fileTreeTerminalId,
                editorTerminalId,
                mainTerminalId,
                title: title || `Untitled-${Date.now()}`,
            });

            skt.emit("createContainer -o1", {
                roomId: newRoom._id,
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
