import { describe } from "@jest/globals";
import bcrypt from 'bcrypt';

import { redisClient } from "../../config/redis";
import { pool } from "../../database/connection";
import { CreateUserService } from "../../services/Users/create-user.service";
import { GetUserService } from "../../services/Users/getUser.service";


jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock('../../services/Users/getUser.service');
const MockedGetUserService = GetUserService as jest.MockedClass<typeof GetUserService>;

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;
const mockPool = pool as jest.Mocked<typeof pool>;

describe("Create User", () => {
    let createUserService: CreateUserService;
    let mockGetUserService: jest.Mocked<GetUserService>;
    const mockUserData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123'
    };

    const mockCreatedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@test.com'
    };


    beforeEach(() => {
        jest.clearAllMocks();

        mockGetUserService = new MockedGetUserService() as jest.Mocked<GetUserService>;

        createUserService = new CreateUserService();

        (createUserService as any).getUserService = mockGetUserService;

    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user successfully', async () => {
        const hashedPassword = 'hashed_password_123';
        const insertId = 1;

        mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

        mockPool.query.mockResolvedValueOnce([
            { insertId, affectedRows: 1 } as any,
            []
        ]);

        mockGetUserService.getUserById.mockResolvedValue(mockCreatedUser);

        const result = await createUserService.createUser(mockUserData);

        expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12);
        expect(mockPool.query).toHaveBeenCalledWith(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            ['John Doe', 'john@test.com', hashedPassword]
        );
        expect(mockGetUserService.getUserById).toHaveBeenCalledWith(insertId);
        expect(result).toEqual(mockCreatedUser);
    });


    it('should handle duplicate email error', async () => {
        const hashedPassword = 'hashed_password_123';

        mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
        mockPool.query.mockRejectedValue({
            code: 'ER_DUP_ENTRY',
            message: 'Duplicate entry for email'
        });

        await expect(createUserService.createUser(mockUserData))
            .rejects.toThrow('Email john@test.com já está cadastrado');

        expect(mockPool.query).toHaveBeenCalledWith(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            ['John Doe', 'john@test.com', hashedPassword]
        );
    });

    it('should handle missing insertId from database', async () => {
        const hashedPassword = 'hashed_password_123';

        mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
        mockPool.query.mockResolvedValueOnce([
            { affectedRows: 1 } as any,
            []
        ]);

        await expect(createUserService.createUser(mockUserData))
            .rejects.toThrow('Failed to create user');
    });

});