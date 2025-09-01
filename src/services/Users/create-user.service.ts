import bcrypt from 'bcrypt';

import { Pool, RowDataPacket } from "mysql2/promise";
import { pool } from "../../database/connection";
import { CreateUserDTO, UserResponse } from "../../types/User";
import { GetUserService } from './getUser.service';

export class CreateUserService {
    private db: Pool;
    private saltRounds = 12;
    private getUserService: GetUserService

    constructor() {
        this.db = pool;
        this.getUserService = new GetUserService();
    }

    async createUser(userData: CreateUserDTO): Promise<UserResponse> {
        try {
            console.log('Creating user with data:', { name: userData.name, email: userData.email });

            const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

            const [result] = await this.db.query<RowDataPacket[]>(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                [userData.name, userData.email, hashedPassword]
            );

            const insertId = (result as any).insertId;
            const newUser = await this.getUserService.getUserById(insertId);

            if (!newUser) {
                throw new Error('Failed to retrieve created user');
            }

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

}