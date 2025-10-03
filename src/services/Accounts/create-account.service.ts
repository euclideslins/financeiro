import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class CreateAccountService {
    private db: Pool
    constructor() {
        this.db = pool
    }

    async createAccount(userId: number): Promise<void> {
        try {
            const [result] = await this.db.query(
                'INSERT INTO accounts (user_id, name, opening_balance_cents) VALUES (?, ?, ?)',
                [userId, 'New Account', 0]
            );

            console.log('Account created with ID:', (result as any).insertId);

        } catch (error) {
            console.error('Error creating account:', error);
            throw new Error('Failed to create account');
        }

    }

}