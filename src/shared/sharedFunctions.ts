import { User, UserResponse } from "../types/User";

export class SharedFunctions {
    public removePassword(user: User): UserResponse {
        const { password_hash, updated_at, created_at, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}