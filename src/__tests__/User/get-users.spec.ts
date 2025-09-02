import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { redisClient } from '../../config/redis';
import { pool } from '../../database/connection';
import { GetUserService } from '../../services/Users/getUser.service';

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;
const mockPool = pool as jest.Mocked<typeof pool>;

describe('GetUserService', () => {
    let getUserService: GetUserService;

    beforeEach(() => {
        jest.clearAllMocks();
        getUserService = new GetUserService();
    });

    describe('getAllUsers', () => {
        it('should return users from cache when cache hit', async () => {
            const mockUsers = [
                { id: 1, name: 'John', email: 'john@test.com', password_hash: 'hash' }
            ];

            mockRedisClient.get.mockResolvedValue(JSON.stringify(mockUsers));

            const result = await getUserService.getAllUsers();

            expect(mockRedisClient.get).toHaveBeenCalledWith('users:all');
            expect(mockPool.query).not.toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('email', 'john@test.com');
            expect(result[0]).toHaveProperty('name', 'John');
            expect(result[0]).toHaveProperty('id', 1);

        });
    });

    it('should return a single user with validated data', async () => {
        const mockUser = {
            id: 1,
            name: 'John',
            email: 'john@test.com',
            password_hash: 'hash'
        };

        const mockResult = { email: "john@test.com", id: 1, name: "John" }

        mockRedisClient.get.mockResolvedValue(JSON.stringify(mockUser));

        const result = await getUserService.getUserById(mockUser.id);
        expect(mockRedisClient.get).toHaveBeenCalledWith(`users:${mockUser.id}`);
        expect(mockPool.query).not.toHaveBeenCalled();
        expect(result).toEqual(mockResult);

        expect(result).toHaveProperty('email', 'john@test.com');
        expect(result).toHaveProperty('name', 'John');
        expect(result).toHaveProperty('id', 1);


    });

    it('should return null when user not found', async () => {
        mockRedisClient.get.mockResolvedValue(null);
        mockPool.query.mockResolvedValue([[], []]);

        const result = await getUserService.getUserById(999);

        expect(result).toBeNull();
        expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
});