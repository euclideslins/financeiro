import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { redisClient } from "../../config/redis";
import { pool } from "../../database/connection";
import { SharedFunctions } from "../../shared/sharedFunctions";
import { User, UserResponse } from "../../types/User";

export class GetUserService {
    private db: Pool;
    private sharedFunctions: SharedFunctions;

    constructor() {
        this.db = pool;
        this.sharedFunctions = new SharedFunctions();
    }

    async getAllUsers(): Promise<UserResponse[]> {
        try {

            const cachedData: User[] = await this.sharedFunctions.redisCachedHit(`users:all`);
            if (cachedData) return cachedData.map(user => this.sharedFunctions.removePassword(user));

            const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
            const users = rows as User[];

            await redisClient.set(`users:all`, JSON.stringify(users));

            return users.map(user => this.sharedFunctions.removePassword(user));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }

    async getUserById(id: number): Promise<UserResponse | null> {
        try {
            const cachedData = await this.sharedFunctions.redisCachedHit(`users:${id}`);
            if (cachedData) return this.sharedFunctions.removePassword(cachedData);

            const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
            if (rows.length === 0) return null;

            const user = rows[0] as User;
            await redisClient.set(`users:${id}`, JSON.stringify(user));
            return this.sharedFunctions.removePassword(user);
        } catch (error) {
            console.error('Error fetching user by id:', error);
            throw new Error('Failed to fetch user');
        }
    }


}