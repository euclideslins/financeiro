import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { AccountGetResponse } from "../../types/Account";

export class GetAccountService {
    private db: Pool
    constructor() {
        this.db = pool
    }

    async getAccountById(accountId: number): Promise<AccountGetResponse> {
        try {
            const [rows] = await this.db.query(
                'SELECT  user_id, name, type, created_at FROM accounts WHERE id = ?',
                [accountId]
            );

            const account = rows as AccountGetResponse[];

            return account[0];

        } catch (error) {
            console.error('Error getting account:', error);
            throw new Error('Failed to get account');
        }
    }


    async getAllAccounts(): Promise<AccountGetResponse[]> {
        try {
            const [rows] = await this.db.query(
                'SELECT user_id, name, type, created_at  FROM accounts'
            );
            const accounts = rows as AccountGetResponse[];
            return accounts;
        } catch (error) {
            console.error('Error getting all accounts:', error);
            throw new Error('Failed to get all accounts');
        }
    }

}