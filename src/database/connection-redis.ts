import { redisClient } from "../config/redis";

export const testConnectionRedis = async (): Promise<boolean> => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const pong = await redisClient.ping();

        if (pong === "PONG") {
            console.log("✅ Redis connected successfully");
            return true;
        }

        console.error("❌ Redis did not respond with PONG");
        return false;
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
        return false;
    }
};
