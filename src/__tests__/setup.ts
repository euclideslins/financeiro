import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';

jest.mock('../config/redis', () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
        setEx: jest.fn(),
        del: jest.fn(),
        connect: jest.fn(),
        quit: jest.fn(),
        isOpen: true,
        on: jest.fn(),
    },
    redisConfig: {
        host: 'localhost',
        port: 6379,
        enabled: false,
    }
}));

jest.mock('../database/connection', () => ({
    pool: {
        query: jest.fn(),
        getConnection: jest.fn(),
        end: jest.fn(),
    },
    testConnection: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
}));