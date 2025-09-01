import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { SharedFunctions } from "../../shared/sharedFunctions";
import { User, UserResponse } from "../../types/User";

export class AuthenticationService {
    private db: Pool;

    private sharedFunctions: SharedFunctions;
    constructor() {
        this.db = pool;
        this.sharedFunctions = new SharedFunctions();
    }

    async authenticateUser(email: string, password: string): Promise<UserResponse | null> {
        try {
            const [rows] = await this.db.query<RowDataPacket[]>(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return null;
            }

            const user = rows[0] as User;
            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return null;
            }

            return this.sharedFunctions.removePassword(user);
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error('Authentication failed');
        }
    }
}