import { Pool } from "mysql2/promise";
import { redisClient } from "../../config/redis";
import { pool } from "../../database/connection";

export class DeleteUserService {
    private db: Pool;
    constructor() {
        this.db = pool;
    }
    async deleteUser(id: number): Promise<boolean> {
        try {
            const [result] = await this.db.query('DELETE FROM users WHERE id = ?', [id]);
            const deleted = (result as any).affectedRows > 0;

            if (deleted) {
                await redisClient.del('users:all');
                await redisClient.del(`users:${id}`);
            }

            return deleted;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
}
