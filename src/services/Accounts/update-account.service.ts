import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class UpdateAccountService {

    private db: Pool
    constructor() {
        this.db = pool;
    }


    async updateAccountName(accountId: number, newName: string): Promise<void> {
        try {
            await this.db.query(
                'UPDATE accounts SET name = ? WHERE id = ?',
                [newName, accountId]
            );
        } catch (error) {
            console.error('Error updating account name:', error);
            throw new Error('Failed to update account name');
        }
    }
}