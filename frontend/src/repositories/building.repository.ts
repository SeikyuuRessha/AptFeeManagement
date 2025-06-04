// repositories/building.repository.ts
import { BaseApiService } from "@/services/api/base.api";
import {
    IBuildingRepository,
    IApartmentRepository,
    Building,
    Apartment,
} from "@/interfaces/repositories/building.repository.interface";
import { AppError, NetworkError } from "@/core/error-handling";

export class BuildingRepository
    extends BaseApiService
    implements IBuildingRepository
{
    constructor() {
        super("/buildings");
    }
    async findAll(): Promise<Building[]> {
        try {
            return await this.get<Building[]>("");
        } catch (error) {
            throw new NetworkError("Failed to fetch buildings", error);
        }
    }

    async findById(id: string): Promise<Building | null> {
        try {
            return await this.get<Building>(`/${id}`);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return null;
            }
            throw new NetworkError(
                `Failed to fetch building with id ${id}`,
                error
            );
        }
    }

    async findByAddress(address: string): Promise<Building[]> {
        try {
            return await this.get<Building[]>(
                `?address=${encodeURIComponent(address)}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch buildings by address: ${address}`,
                error
            );
        }
    }

    private isNotFoundError(error: any): boolean {
        return error?.response?.status === 404;
    }
}

export class ApartmentRepository
    extends BaseApiService
    implements IApartmentRepository
{
    constructor() {
        super("/apartments");
    }

    async findAll(): Promise<Apartment[]> {
        try {
            return await this.get<Apartment[]>("");
        } catch (error) {
            throw new NetworkError("Failed to fetch apartments", error);
        }
    }

    async findById(id: string): Promise<Apartment | null> {
        try {
            return await this.get<Apartment>(`/${id}`);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return null;
            }
            throw new NetworkError(
                `Failed to fetch apartment with id ${id}`,
                error
            );
        }
    }

    async findByBuildingId(buildingId: string): Promise<Apartment[]> {
        try {
            return await this.get<Apartment[]>(`?buildingId=${buildingId}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch apartments for building ${buildingId}`,
                error
            );
        }
    }

    async findByFloor(floor: number): Promise<Apartment[]> {
        try {
            return await this.get<Apartment[]>(`?floor=${floor}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch apartments on floor ${floor}`,
                error
            );
        }
    }

    private isNotFoundError(error: any): boolean {
        return error?.response?.status === 404;
    }
}
