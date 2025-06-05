import { BaseApiService } from "../services/api/base.api";
import {
    IUser,
    IUserRepository,
} from "../interfaces/repositories/user.repository.interface";
import { NetworkError } from "../core/error-handling";

/**
 * User Repository implementation
 * Follows Single Responsibility Principle by handling only user data operations
 */
export class UserRepository extends BaseApiService implements IUserRepository {
    constructor() {
        super("/residents");
    }

    async findAll(): Promise<IUser[]> {
        try {
            return await this.get<IUser[]>("");
        } catch (error) {
            throw new NetworkError("Failed to fetch users", error);
        }
    }

    async findById(id: string): Promise<IUser | null> {
        try {
            return await this.get<IUser>(`/${id}`);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return null;
            }
            throw new NetworkError(`Failed to fetch user with id ${id}`, error);
        }
    }

    async getUsers(): Promise<IUser[]> {
        return this.findAll();
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await this.findById(id);
        if (!user) {
            throw new NetworkError(`User with id ${id} not found`);
        }
        return user;
    }
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            return await this.post<IUser>("/register", userData);
        } catch (error) {
            throw new NetworkError("Failed to create user", error);
        }
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
        try {
            return await this.put<IUser>(`/${id}`, userData);
        } catch (error) {
            throw new NetworkError(
                `Failed to update user with id ${id}`,
                error
            );
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            await this.delete(`/${id}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to delete user with id ${id}`,
                error
            );
        }
    }

    async searchResidents(query: string): Promise<IUser[]> {
        try {
            return await this.get<IUser[]>(
                `/search?q=${encodeURIComponent(query)}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to search residents with query: ${query}`,
                error
            );
        }
    }

    async getUserProfile(): Promise<IUser> {
        try {
            return await this.get<IUser>("/me/profile");
        } catch (error) {
            throw new NetworkError("Failed to fetch user profile", error);
        }
    }

    private isNotFoundError(error: any): boolean {
        return error?.response?.status === 404;
    }
}
