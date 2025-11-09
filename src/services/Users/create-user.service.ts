import bcrypt from 'bcrypt';

import { Pool, RowDataPacket } from "mysql2/promise";
import { redisClient } from "../../config/redis";
import { pool } from "../../database/connection";
import { DuplicateEmailError } from '../../shared/errors/AppError';
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

            await redisClient.del('users:all');

            const newUser = await this.getUserService.getUserById(insertId);

            if (!newUser) {
                throw new Error('Failed to retrieve created user');
            }

            return newUser;
        } catch (error: any) {
            console.error('Error creating user:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new DuplicateEmailError(userData.email);
            }

            throw new Error('Failed to create user');
        }
    }

}