import { Server } from "socket.io";
import Docker from "dockerode";

import { createContainer } from "./listeners/createContainer.js";

import { createMainTerminal } from "./listeners/mainTerminal/createMainTerminal.js";
import { connectMainTerminal } from "./listeners/mainTerminal/connectMainTerminal.js";

import { createFileTreeTerminal } from "./listeners/fileTreeTerminal/createFileTreeTerminal.js";
import { connectFileTreeTerminal } from "./listeners/fileTreeTerminal/connectFileTreeTerminal.js";

import { createEditorTerminal } from "./listeners/editorTerminal/createEditorTerminal.js";
import { connectEditorTerminal } from "./listeners/editorTerminal/connectEditorTerminal.js";

const docker = new Docker();
const io = new Server({ cors: { origin: "*" } });

let cnt = 0;

const listeners = [
    createContainer,

    createMainTerminal,
    connectMainTerminal,

    createEditorTerminal,
    connectEditorTerminal,

    createFileTreeTerminal,
    connectFileTreeTerminal,
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
export { docker };

io.listen(4000);
console.log("Socket at 4000");
