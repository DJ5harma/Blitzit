import { Server } from "socket.io";
import Docker from "dockerode";
import { createContainer } from "./listeners/createContainer.js";
import { createTerminal } from "./listeners/createTerminal.js";
import { connectTerminal } from "./listeners/connectTerminal.js";
import { connectFileTerminal } from "./listeners/connectFileTerminal.js";
import { createFileTerminal } from "./listeners/createFileTerminal.js";

const docker = new Docker();
const io = new Server({ cors: { origin: "*" } });

let cnt = 0;

io.on("connection", async (socket) => {
    console.log("connected", ++cnt);

    createContainer(socket);
    createTerminal(socket);
    connectTerminal(socket);

    createFileTerminal(socket);
    connectFileTerminal(socket);

    socket.on("disconnect", () => {
        console.log("disconnected", --cnt);
    });
});
export { docker };

io.listen(4000);
console.log("Socket at 4000");
