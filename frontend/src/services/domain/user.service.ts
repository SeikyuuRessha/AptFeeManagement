import {
    IUser,
    IUserRepository,
} from "../../interfaces/repositories/user.repository.interface";

/**
 * User Service Domain Layer
 * Follows Single Responsibility Principle by handling only user business logic
 * Follows Dependency Inversion Principle by depending on abstractions
 */
export class UserService {
    constructor(private userRepository: IUserRepository) {}

    async getAllUsers(): Promise<IUser[]> {
        try {
            return await this.userRepository.getUsers();
        } catch (error) {
            throw new Error(
                `Failed to fetch users: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async getUserById(id: string): Promise<IUser> {
        if (!id) {
            throw new Error("User ID is required");
        }

        try {
            return await this.userRepository.getUserById(id);
        } catch (error) {
            throw new Error(
                `Failed to fetch user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        this.validateUserData(userData);

        try {
            return await this.userRepository.createUser(userData);
        } catch (error) {
            throw new Error(
                `Failed to create user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
        if (!id) {
            throw new Error("User ID is required");
        }

        this.validateUserData(userData, false);

        try {
            return await this.userRepository.updateUser(id, userData);
        } catch (error) {
            throw new Error(
                `Failed to update user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async deleteUser(id: string): Promise<void> {
        if (!id) {
            throw new Error("User ID is required");
        }

        try {
            return await this.userRepository.deleteUser(id);
        } catch (error) {
            throw new Error(
                `Failed to delete user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async searchResidents(query: string): Promise<IUser[]> {
        if (!query || query.trim().length < 2) {
            throw new Error("Search query must be at least 2 characters long");
        }

        try {
            return await this.userRepository.searchResidents(query.trim());
        } catch (error) {
            throw new Error(
                `Failed to search residents: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async getCurrentUserProfile(): Promise<IUser> {
        try {
            return await this.userRepository.getUserProfile();
        } catch (error) {
            throw new Error(
                `Failed to fetch user profile: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    private validateUserData(
        userData: Partial<IUser>,
        isCreate: boolean = true
    ): void {
        if (isCreate) {
            if (!userData.fullName?.trim()) {
                throw new Error("Full name is required");
            }
            if (!userData.email?.trim()) {
                throw new Error("Email is required");
            }
            if (!this.isValidEmail(userData.email)) {
                throw new Error("Invalid email format");
            }
        } else {
            if (userData.email && !this.isValidEmail(userData.email)) {
                throw new Error("Invalid email format");
            }
        }

        if (userData.phone && !this.isValidPhone(userData.phone)) {
            throw new Error("Invalid phone number format");
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
    }
}
