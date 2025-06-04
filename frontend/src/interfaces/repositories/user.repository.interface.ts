import { IReadable } from "./base.repository.interface";

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "resident";
    createdAt: string;
    updatedAt: string;
}

export interface IUserRepository extends IReadable<IUser> {
    getUsers(): Promise<IUser[]>;
    getUserById(id: string): Promise<IUser>;
    createUser(userData: Partial<IUser>): Promise<IUser>;
    updateUser(id: string, userData: Partial<IUser>): Promise<IUser>;
    deleteUser(id: string): Promise<void>;
    searchResidents(query: string): Promise<IUser[]>;
    getUserProfile(): Promise<IUser>;
}
