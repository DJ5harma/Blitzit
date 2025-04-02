import { Server } from "socket.io";
import Docker from "dockerode";

import { createContainer } from "./listeners/createContainer.js";
import { connectMainTerminal } from "./listeners/mainTerminal/connectMainTerminal.js";
import { connectFileTreeTerminal } from "./listeners/fileTreeTerminal/connectFileTreeTerminal.js";
import { connectEditorTerminal } from "./listeners/editorTerminal/connectEditorTerminal.js";

import { dbConnect } from "./database/dbConnect.js";
import { getRoomDetails } from "./listeners/getRoomDetails.js";
import { redisConnect } from "./redis/redis.js";

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
    console.log("connected", ++cnt);

    listeners.forEach((listener) => {
        listener(socket);
    });

    socket.on("disconnect", () => {
        console.log("disconnected", --cnt);
    });
});

dbConnect("mongodb://localhost:27017/Blitzit").then(() => {
    redisConnect().then(() => {
        io.listen(4000);
        console.log("Socket at 4000");
    });
});

export { docker };