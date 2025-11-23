import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class GetUserTransactionsService {

    private db: Pool;
    constructor() {
        this.db = pool;

    }

    async getUserTransactions(user_id: number): Promise<any[]> {
        try {
            const [rows] = await this.db.query(
                `SELECT t.* FROM transactions t
                    WHERE t.user_id = ? AND t.deleted_at IS NULL`,
                [user_id]
            );
            return rows as any[];
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Error fetching transactions for user ${user_id}: ${message}`);
        }
    }
}