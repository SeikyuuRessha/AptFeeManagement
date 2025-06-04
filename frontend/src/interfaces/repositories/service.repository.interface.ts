// interfaces/repositories/service.repository.interface.ts
import { IReadable } from "./base.repository.interface";

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IServiceRepository extends IReadable<Service> {
    findByCategory(category: string): Promise<Service[]>;
    findActiveServices(): Promise<Service[]>;
    findByPriceRange(minPrice: number, maxPrice: number): Promise<Service[]>;
}
