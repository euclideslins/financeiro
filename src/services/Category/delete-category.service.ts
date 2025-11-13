import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";

export class DeleteCategoryService {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async deleteCategory(categoryId: number): Promise<boolean> {
        try {
            const [result] = await this.db.query(
                'UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [categoryId]
            );

            const affectedRows = (result as any).affectedRows;
            return affectedRows > 0;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw new Error('Failed to delete category');
        }
    }
}
