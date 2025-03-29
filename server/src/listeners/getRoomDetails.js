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
    skt.on("getRoomDetails", async ({ roomId }) => {
        try {
            console.log({ roomId });
            const room = await ROOM.findById(roomId);
            const { mainTerminalId, fileTreeTerminalId, editorTerminalId } =
                room;

            console.log({ room });
            
            skt.emit("getRoomDetails -o1", {
                mainTerminalId,
                fileTreeTerminalId,
                editorTerminalId,
            });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
