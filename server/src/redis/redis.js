import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL });
export const subscriber = redis.duplicate();

export const redisConnect = async () => {
    redis.on("error", (err) => console.log("Redis 1 Client error", err));
    subscriber.on("error", (err) => console.log("Redis 2 Client error", err));

    await Promise.all([redis.connect(), subscriber.connect()]);
    console.log("Redis 1 & 2 connected on PORT :", 6379);
};
