// interfaces/repositories/building.repository.interface.ts
import { IReadable } from "./base.repository.interface";

export interface Building {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface Apartment {
    id: string;
    buildingId: string;
    apartmentNumber: string;
    floor: number;
    area: number;
    createdAt: string;
    updatedAt: string;
}

export interface IBuildingRepository extends IReadable<Building> {
    findByAddress(address: string): Promise<Building[]>;
}

export interface IApartmentRepository extends IReadable<Apartment> {
    findByBuildingId(buildingId: string): Promise<Apartment[]>;
    findByFloor(floor: number): Promise<Apartment[]>;
}
