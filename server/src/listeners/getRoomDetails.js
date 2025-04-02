import { Socket } from "socket.io";
import { ROOM } from "../database/ROOM.js";

/**
 * Description
 *
 * @function
 * @name getRoomDetails
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const getRoomDetails = (skt) => {
    skt.on("getRoomDetails", async ({ roomId }, callback) => {
        try {
            console.log({ roomId });
            const room = await ROOM.findById(roomId);
            const {
                mainTerminalId,
                fileTreeTerminalId,
                editorTerminalId,
                containerId,
            } = room;

            console.log({ room });

            callback({
                mainTerminalId,
                fileTreeTerminalId,
                editorTerminalId,
                containerId,
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
