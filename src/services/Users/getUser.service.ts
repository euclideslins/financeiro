import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { User, UserResponse } from "../../types/User";

export class GetUserService {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    private removePassword(user: User): UserResponse {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getAllUsers(): Promise<UserResponse[]> {
        try {
            const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
            const users = rows as User[];
            return users.map(user => this.removePassword(user));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }

    async getUserById(id: number): Promise<UserResponse | null> {
        try {
            const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
            if (rows.length === 0) return null;

            const user = rows[0] as User;
            return this.removePassword(user);
        } catch (error) {
            console.error('Error fetching user by id:', error);
            throw new Error('Failed to fetch user');
        }
    }


}