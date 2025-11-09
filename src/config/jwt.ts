import { config } from 'dotenv';

config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment variables');
}

export const jwtConfig = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || '12h') as string
};
