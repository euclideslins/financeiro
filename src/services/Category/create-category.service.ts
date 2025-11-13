import { ResultSetHeader } from "mysql2";
import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { Category, KindEnum } from "../../types/Category";
import { GetUserService } from "../Users/getUser.service";

export class CreateCategoryService {
    private db: Pool;
    private getUserService: GetUserService;


    constructor() {
        this.db = pool;
        this.getUserService = new GetUserService();
    }

    async createCategory(name: string, kind: KindEnum, parent_id: number | null, user_id: number): Promise<Category> {
        try {
            const user = await this.getUserService.getUserById(user_id);
            if (!user) throw new Error("User not found");

            const [result] = await this.db.query<ResultSetHeader>(
                "INSERT INTO categories (name, kind, parent_id, user_id) VALUES (?, ?, ?, ?)",
                [name, kind, parent_id, user_id]
            );

            return {
                id: result.insertId,
                user_id,
                name,
                kind,
                created_at: (result as any).created_at || new Date(),
                updated_at: (result as any).updated_at || new Date(),
            };
        } catch (error: any) {
            console.error('Error creating category:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                const { DuplicateCategoryError } = require('../../shared/errors/AppError');
                throw new DuplicateCategoryError(name);
            }

            throw error;
        }
    }

}

