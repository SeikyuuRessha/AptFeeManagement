import { useState, useEffect, useCallback } from "react";
import { AppBootstrap, SERVICE_TOKENS } from "../core/app-bootstrap";
import { UserService } from "../services/domain/user.service";
import { IUser } from "../interfaces/repositories/user.repository.interface";

/**
 * Custom hook for user management
 * Follows Single Responsibility Principle by handling only user state management
 * Uses Dependency Injection for loose coupling
 */
export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get service through DI container
    const userService = AppBootstrap.getService<UserService>(
        SERVICE_TOKENS.USER_SERVICE
    );

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedUsers = await userService.getAllUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch users"
            );
        } finally {
            setLoading(false);
        }
    }, [userService]);

    const createUser = useCallback(
        async (userData: Partial<IUser>) => {
            try {
                setLoading(true);
                setError(null);
                const newUser = await userService.createUser(userData);
                setUsers((prev) => [...prev, newUser]);
                return newUser;
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to create user";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [userService]
    );

    const updateUser = useCallback(
        async (id: string, userData: Partial<IUser>) => {
            try {
                setLoading(true);
                setError(null);
                const updatedUser = await userService.updateUser(id, userData);
                setUsers((prev) =>
                    prev.map((user) => (user.id === id ? updatedUser : user))
                );
                return updatedUser;
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to update user";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [userService]
    );

    const deleteUser = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                setError(null);
                await userService.deleteUser(id);
                setUsers((prev) => prev.filter((user) => user.id !== id));
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to delete user";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [userService]
    );
    const searchUsers = useCallback(
        async (query: string) => {
            try {
                setLoading(true);
                setError(null);
                const searchResults = await userService.searchResidents(query);
                setUsers(searchResults); // Update the users state with search results
                return searchResults;
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to search users";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [userService]
    );

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
        clearError: () => setError(null),
    };
};
