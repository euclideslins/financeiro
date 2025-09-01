import { config } from "dotenv";
import { createClient } from "redis";

config();

export const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0", 10),
};

export const redisClient = createClient({
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
    },
    password: redisConfig.password,
    database: redisConfig.db,
});

redisClient.on("connect", () => {
    console.log("✅ Redis conectado com sucesso");
});

redisClient.on("error", (err) => {
    console.error("❌ Erro no Redis:", err);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Erro ao conectar no Redis:", err);
    }
})();
