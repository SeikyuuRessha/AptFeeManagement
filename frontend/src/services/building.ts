import api from "@/config/api";
import { IResponse } from "./service";

export interface Building {
    id: string;
    name: string;
    address: string;
    numberOfFloors: number;
    createdAt: string;
    updatedAt: string;
}

export interface Apartment {
    id: string;
    roomNumber: number;
    area: number;
    buildingId: string;
    residentId: string | null;
    createdAt: string;
    updatedAt: string;
}

export const getBuildings = async (): Promise<Building[]> => {
    const res = (await api.get("/buildings")) as IResponse<Building[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getApartments = async (): Promise<Apartment[]> => {
    const res = (await api.get("/apartments")) as IResponse<Apartment[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const createApartment = async (apartmentData: {
    roomNumber: number;
    area: number;
    buildingId: string;
}): Promise<Apartment> => {
    const res = (await api.post(
        "/apartments",
        apartmentData
    )) as IResponse<Apartment>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};
