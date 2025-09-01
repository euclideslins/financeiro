import { redisClient } from "../config/redis";
import { User, UserResponse } from "../types/User";

export class SharedFunctions {
    public removePassword(user: User): UserResponse {
        const { password_hash, updated_at, created_at, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    public async redisCachedHit(cacheKey: string) {
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log("✅ Redis cache hit");
            return JSON.parse(cached);
        }

    }
}
