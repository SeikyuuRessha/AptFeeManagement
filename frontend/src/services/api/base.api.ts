import api from "@/config/api";
import { IResponse } from "@/interfaces/response";

/**
 * Base API service that provides common HTTP operations
 * Follows Single Responsibility Principle by handling only HTTP requests
 */
export abstract class BaseApiService {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected async get<T>(endpoint: string): Promise<T> {
        const response = (await api.get(
            `${this.baseUrl}${endpoint}`
        )) as IResponse<T>;

        if (response.code === 0) {
            throw new Error(response.msg);
        }

        return response.data;
    }

    protected async post<T, U = any>(endpoint: string, data: U): Promise<T> {
        const response = (await api.post(
            `${this.baseUrl}${endpoint}`,
            data
        )) as IResponse<T>;

        if (response.code === 0) {
            throw new Error(response.msg);
        }

        return response.data;
    }

    protected async put<T, U = any>(endpoint: string, data: U): Promise<T> {
        const response = (await api.put(
            `${this.baseUrl}${endpoint}`,
            data
        )) as IResponse<T>;

        if (response.code === 0) {
            throw new Error(response.msg);
        }

        return response.data;
    }

    protected async delete(endpoint: string): Promise<void> {
        const response = (await api.delete(
            `${this.baseUrl}${endpoint}`
        )) as IResponse<void>;

        if (response.code === 0) {
            throw new Error(response.msg);
        }
    }
}
