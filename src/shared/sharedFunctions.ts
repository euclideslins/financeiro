import { User, UserResponse } from "../types/User";

export class SharedFunctions {
    public removePassword(user: User): UserResponse {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}