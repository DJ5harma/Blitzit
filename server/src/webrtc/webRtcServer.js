#!/usr/bin/env node

// Taken from yjs webrtc server and modified to scale by redis integration with AI help cause it'd take much time to understand this ourselves and

// original credit: https://github.com/yjs/y-webrtc/blob/master/bin/server.js

// Ideally, we should be using an already deployed server anyways but it seems their (yjs's) STUNs are not working, so we're hosting it ourselves


import { WebSocketServer } from "ws";
import http from "http";
import * as map from "lib0/map";
import { subscriber, redis } from "../redis/redis.js";

export const webRtcServer = () => {
    const port = process.env.PORT || 4444;
    const pingTimeout = 30000;

    const wss = new WebSocketServer({ noServer: true });

    const server = http.createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Signaling server okay");
    });

    const localTopicSubs = new Map(); // topic: Set<ws>

    const send = (conn, message) => {
        if (conn.readyState === conn.OPEN) {
            try {
                conn.send(JSON.stringify(message));
            } catch {
                conn.close();
            }
        }
    };

    const activeRedisHandlers = new Set();

    const onConnection = (conn) => {
        const subscribedTopics = new Set();
        let closed = false;
        let pongReceived = true;

        const pingInterval = setInterval(() => {
            if (!pongReceived) {
                conn.terminate();
                clearInterval(pingInterval);
            } else {
                pongReceived = false;
                try {
                    conn.ping();
                } catch {
                    conn.terminate();
                }
            }
        }, pingTimeout);

        conn.on("pong", () => (pongReceived = true));

        conn.on("close", async () => {
            for (const topic of subscribedTopics) {
                const subs = localTopicSubs.get(topic);
                if (subs) {
                    subs.delete(conn);
                    if (subs.size === 0) {
                        localTopicSubs.delete(topic);
                        // Leave redis subscription if no local clients
                        if (activeRedisHandlers.has(topic)) {
                            await subscriber.unsubscribe(topic);
                            activeRedisHandlers.delete(topic);
                        }
                    }
                }
            }
            subscribedTopics.clear();
            closed = true;
            clearInterval(pingInterval);
        });

        conn.on("message", async (msg) => {
            let message;
            try {
                message =
                    typeof msg === "string"
                        ? JSON.parse(msg)
                        : JSON.parse(msg.toString());
            } catch {
                return;
            }

            if (!message?.type || closed) return;

            switch (message.type) {
                case "subscribe":
                    for (const topic of message.topics || []) {
                        if (typeof topic !== "string") continue;

                        const subs = map.setIfUndefined(
                            localTopicSubs,
                            topic,
                            () => new Set()
                        );
                        subs.add(conn);

                        if (!subscribedTopics.has(topic)) {
                            subscribedTopics.add(topic);

                            if (!activeRedisHandlers.has(topic)) {
                                await subscriber.subscribe(
                                    topic,
                                    (msgStr, channel) => {
                                        const clients =
                                            localTopicSubs.get(channel);
                                        if (!clients) return;

                                        let parsed;
                                        try {
                                            parsed = JSON.parse(msgStr);
                                        } catch {
                                            return;
                                        }

                                        parsed.clients = clients.size;
                                        clients.forEach((ws) =>
                                            send(ws, parsed)
                                        );
                                    }
                                );

                                activeRedisHandlers.add(topic);
                            }
                        }

                        await redis.set(
                            `topic:${topic}:last_subscribed`,
                            Date.now()
                        );
                    }
                    break;

                case "unsubscribe":
                    for (const topic of message.topics || []) {
                        const subs = localTopicSubs.get(topic);
                        subs?.delete(conn);

                        if (subs?.size === 0) {
                            localTopicSubs.delete(topic);
                            await subscriber.unsubscribe(topic);
                            activeRedisHandlers.delete(topic);
                        }

                        subscribedTopics.delete(topic);
                    }
                    break;

                case "publish":
                    if (message.topic) {
                        const payload = JSON.stringify(message);
                        await redis.publish(message.topic, payload);
                        await redis.set(
                            `topic:${message.topic}:last_published`,
                            Date.now()
                        );
                    }
                    break;

                case "ping":
                    send(conn, { type: "pong" });
                    break;
            }
        });
    };

    wss.on("connection", onConnection);

    server.on("upgrade", (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    });

    server.listen(port, () => {
        console.log("Redis signaling server running on port", port);
    });
};
