// repositories/service.repository.ts
import { BaseApiService } from "@/services/api/base.api";
import {
    IServiceRepository,
    Service,
} from "@/interfaces/repositories/service.repository.interface";
import { NetworkError } from "@/core/error-handling";

export class ServiceRepository
    extends BaseApiService
    implements IServiceRepository
{
    constructor() {
        super("/services");
    }

    async findAll(): Promise<Service[]> {
        try {
            return await this.get<Service[]>("");
        } catch (error) {
            throw new NetworkError("Failed to fetch services", error);
        }
    }

    async findById(id: string): Promise<Service | null> {
        try {
            return await this.get<Service>(`/${id}`);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return null;
            }
            throw new NetworkError(
                `Failed to fetch service with id ${id}`,
                error
            );
        }
    }

    async findByCategory(category: string): Promise<Service[]> {
        try {
            return await this.get<Service[]>(
                `?category=${encodeURIComponent(category)}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch services by category: ${category}`,
                error
            );
        }
    }

    async findActiveServices(): Promise<Service[]> {
        try {
            return await this.get<Service[]>("?isActive=true");
        } catch (error) {
            throw new NetworkError("Failed to fetch active services", error);
        }
    }

    async findByPriceRange(
        minPrice: number,
        maxPrice: number
    ): Promise<Service[]> {
        try {
            return await this.get<Service[]>(
                `?minPrice=${minPrice}&maxPrice=${maxPrice}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch services in price range ${minPrice}-${maxPrice}`,
                error
            );
        }
    }

    private isNotFoundError(error: any): boolean {
        return error?.response?.status === 404;
    }
}
