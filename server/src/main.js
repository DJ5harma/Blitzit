import { Server } from "socket.io";
import Docker from "dockerode";
import { createContainer } from "./listeners/createContainer.js";
import { dbConnect } from "./database/dbConnect.js";
import { redisConnect } from "./redis/redis.js";
import { webRtcServer } from "./webrtc/webRtcServer.js";
import { connectTerminals } from "./listeners/connectTerminals.js";
import { config as configEnv } from "dotenv";
import { createClient } from "redis";

configEnv();
const docker = new Docker();

const io = new Server({
	cors: {
		origin: process.env.CLIENT_PORT || "http://localhost:3000", // Explicit client origin
		methods: ["GET", "POST"],
	},
	transports: ["websocket", "polling"], // Explicit transport order
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

const redis = createClient({
	url: process.env.REDIS_URI || "redis://redis:6379",
});
const subscriber = redis.duplicate();

dbConnect().then(() => {
	redis.connect().then(() => {
		subscriber.connect().then(() => {
			io.listen(4000);
			console.log("Socket at 4000");
			webRtcServer();
		});
	});
});

export { docker, redis, subscriber };
