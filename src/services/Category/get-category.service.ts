import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { Category } from "../../types/Category";

export class GetCategoryService {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async getCategoryById(categoryId: number): Promise<Category | null> {
        try {
            const [rows] = await this.db.query<RowDataPacket[]>(
                'SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL',
                [categoryId]
            );

            if (rows.length === 0) {
                return null;
            }

            return rows[0] as Category;
        } catch (error) {
            console.error('Error getting category by id:', error);
            throw new Error('Failed to get category');
        }
    }

    async getAllCategoriesByUser(userId: number): Promise<Category[]> {
        try {
            const [rows] = await this.db.query<RowDataPacket[]>(
                'SELECT * FROM categories WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
                [userId]
            );

            return rows as Category[];
        } catch (error) {
            console.error('Error getting categories by user:', error);
            throw new Error('Failed to get categories');
        }
    }
}
