import bcrypt from 'bcrypt';
import JsonWebToken from 'jsonwebtoken';
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { pool } from "../../database/connection";
import { SharedFunctions } from '../../shared/sharedFunctions';
import { User, UserLoginResponse } from "../../types/User";


export class AuthenticationService {
    private db: Pool;

    private sharedFunctions: SharedFunctions;
    constructor() {
        this.db = pool;
        this.sharedFunctions = new SharedFunctions();
    }

    async authenticateUser(email: string, password: string): Promise<UserLoginResponse | null> {
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
            const data = this.sharedFunctions.removePassword(user);

            const token = JsonWebToken.sign({ data }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
            return { token };
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error('Authentication failed');
        }
    }
}