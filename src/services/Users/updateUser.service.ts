import bcrypt from 'bcrypt';

import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { UpdateUserDTO, UserResponse } from "../../types/User";
import { GetUserService } from "./getUser.service";

export class UpdateUserService {
    private getUserService: GetUserService;

    private db: Pool;
    private saltRounds = 12;

    constructor() {
        this.getUserService = new GetUserService();
        this.db = pool;
    }

    async updateUser(id: number, userData: UpdateUserDTO): Promise<UserResponse | null> {
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (userData.name) {
                updates.push('name = ?');
                values.push(userData.name);
            }

            if (userData.email) {
                updates.push('email = ?');
                values.push(userData.email);
            }

            if (userData.password) {
                const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
                updates.push('password_hash = ?');
                values.push(hashedPassword);
            }

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            await this.db.query(
                `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            return this.getUserService.getUserById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

}
