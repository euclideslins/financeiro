import { describe, expect } from '@jest/globals';
import { SharedFunctions } from '../../shared/sharedFunctions';
import { User } from '../../types/User';

const removePassword = new SharedFunctions().removePassword;

describe("Remove Password", () => {
    it("should remove sensitive data from user object", () => {

        const user: User = {
            id: 123,
            name: "Test User",
            email: "test@example.com",
            password_hash: "hashed_password",
            created_at: new Date(),
            updated_at: new Date(),
        }

        const result = removePassword(user);
        expect(result).toEqual({
            id: 123,
            name: "Test User",
            email: "test@example.com"
        });

        expect(result).not.toHaveProperty("password_hash");
        expect(result).not.toHaveProperty("created_at");
        expect(result).not.toHaveProperty("updated_at");
    })
})