import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class GetAllUsersCategoryService {

    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async getAllUsersCategory(user_id: number) {
        const [rows] = await this.db.query('SELECT * FROM categories WHERE user_id = ?', [user_id]);
        return rows;
    }
}