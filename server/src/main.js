import { Server } from "socket.io";
import Docker from "dockerode";
import { createContainer } from "./listeners/createContainer.js";
import { dbConnect } from "./database/dbConnect.js";
import { redisConnect } from "./redis/redis.js";
import { webRtcServer } from "./webrtc/webRtcServer.js";
import { connectTerminals } from "./listeners/connectTerminals.js";

const docker = new Docker();
const io = new Server({
    cors: {
      origin: "http://localhost:3000", // Explicit client origin
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'] // Explicit transport order
  });
let cnt = 0;

io.on("connection", async (socket) => {
    console.log("connected", ++cnt, socket.id);
    socket.on("disconnect", () => {
        console.log("disconnected", --cnt, socket.id);
    });

    createContainer(socket);
    connectTerminals(socket);
});

dbConnect("mongodb://mongo:27017/BLITZIT").then(() => {
    redisConnect().then(() => {
        io.listen(4000);
        console.log("Socket at 4000");
        webRtcServer();
    });
});

export { docker };
