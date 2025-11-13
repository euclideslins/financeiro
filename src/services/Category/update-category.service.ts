import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { Category } from "../../types/Category";
import { GetCategoryService } from "./get-category.service";

export class UpdateCategoryService {
    private db: Pool;
    private getCategoryService: GetCategoryService;

    constructor() {
        this.db = pool;
        this.getCategoryService = new GetCategoryService();
    }

    async updateCategory(categoryId: number, name?: string, kind?: 'expense' | 'income'): Promise<Category | null> {
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (name) {
                updates.push('name = ?');
                values.push(name);
            }

            if (kind) {
                updates.push('kind = ?');
                values.push(kind);
            }

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(categoryId);

            const [result] = await this.db.query(
                `UPDATE categories SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
                values
            );

            const affectedRows = (result as any).affectedRows;

            if (affectedRows === 0) {
                return null;
            }

            return this.getCategoryService.getCategoryById(categoryId);
        } catch (error) {
            console.error('Error updating category:', error);
            throw new Error('Failed to update category');
        }
    }
}
