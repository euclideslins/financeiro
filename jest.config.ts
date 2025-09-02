import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: ['**/__tests__/**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};

export default config;