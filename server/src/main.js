import { Server } from "socket.io";
import Docker from "dockerode";

import { createContainer } from "./listeners/createContainer.js";
import { connectMainTerminal } from "./listeners/mainTerminal/connectMainTerminal.js";
import { connectFileTreeTerminal } from "./listeners/fileTreeTerminal/connectFileTreeTerminal.js";
import { connectEditorTerminal } from "./listeners/editorTerminal/connectEditorTerminal.js";

import { dbConnect } from "./database/dbConnect.js";
import { getRoomDetails } from "./listeners/getRoomDetails.js";
import { redisConnect } from "./redis/redis.js";
import { webRtcServer } from "./webrtc/webRtcServer.js";

const docker = new Docker();
const io = new Server({ cors: { origin: "*" } });

let cnt = 0;

const listeners = [
    createContainer,

    connectMainTerminal,

    connectEditorTerminal,

    connectFileTreeTerminal,

    getRoomDetails,
];

io.on("connection", async (socket) => {
    console.log("connected", ++cnt, socket.id);
    socket.on("disconnect", () => {
        console.log("disconnected", --cnt, socket.id);
    });

    listeners.forEach((listener) => {
        listener(socket);
    });
});

dbConnect("mongodb://localhost:27017/Blitzit").then(() => {
    redisConnect().then(() => {
        io.listen(4000);
        console.log("Socket at 4000");
        webRtcServer();
    });
});

export { docker };
