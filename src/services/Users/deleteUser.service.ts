import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class DeleteUserService {
    private db: Pool;
    constructor() {
        this.db = pool;
    }
    async deleteUser(id: number): Promise<boolean> {
        try {
            const [result] = await this.db.query('DELETE FROM users WHERE id = ?', [id]);
            return (result as any).affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
}
