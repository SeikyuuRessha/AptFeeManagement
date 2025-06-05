import {
    ISearchStrategy,
    ISearchable,
} from "../interfaces/strategies/search.strategy.interface";
import { IUser } from "../interfaces/repositories/user.repository.interface";

/**
 * User search strategy implementation
 * Follows Open/Closed Principle by implementing the search interface
 */
export class UserSearchStrategy implements ISearchStrategy<IUser> {
    search(users: IUser[], query: string): IUser[] {
        if (!query.trim()) return users;

        const searchTerm = query.toLowerCase().trim();

        return users.filter(
            (user) =>
                user.fullName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.phone.toLowerCase().includes(searchTerm) ||
                user.role.toLowerCase().includes(searchTerm)
        );
    }
}

/**
 * Generic fuzzy search strategy
 */
export class FuzzySearchStrategy<T extends ISearchable>
    implements ISearchStrategy<T>
{
    constructor(private searchableFields: (keyof T)[]) {}

    search(items: T[], query: string): T[] {
        if (!query.trim()) return items;

        const searchTerm = query.toLowerCase().trim();

        return items.filter((item) =>
            this.searchableFields.some((field) => {
                const value = item[field];
                return (
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchTerm)
                );
            })
        );
    }
}

/**
 * Exact match search strategy
 */
export class ExactMatchSearchStrategy<T extends ISearchable>
    implements ISearchStrategy<T>
{
    constructor(private searchableFields: (keyof T)[]) {}

    search(items: T[], query: string): T[] {
        if (!query.trim()) return items;

        const searchTerm = query.toLowerCase().trim();

        return items.filter((item) =>
            this.searchableFields.some((field) => {
                const value = item[field];
                return (
                    typeof value === "string" &&
                    value.toLowerCase() === searchTerm
                );
            })
        );
    }
}
