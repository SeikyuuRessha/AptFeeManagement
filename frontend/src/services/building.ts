import api from "@/config/api";
import { IResponse } from "./service";

export interface Building {
    id: string;
    name: string;
    address: string;
    apartmentCount: number;
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
    residentId?: string;
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

export const createBuilding = async (buildingData: {
    name: string;
    address: string;
    apartmentCount: number;
}): Promise<Building> => {
    const res = (await api.post(
        "/buildings",
        buildingData
    )) as IResponse<Building>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const updateBuilding = async (
    id: string,
    buildingData: {
        name: string;
        address: string;
        apartmentCount: number;
    }
): Promise<Building> => {
    const res = (await api.put(
        `/buildings/${id}`,
        buildingData
    )) as IResponse<Building>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const deleteBuilding = async (id: string): Promise<void> => {
    const res = (await api.delete(`/buildings/${id}`)) as IResponse<void>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }
};

export const assignResident = async (
    apartmentId: string,
    residentId: string | null
): Promise<Apartment> => {
    const res = (await api.put(`/apartments/${apartmentId}/assign-resident`, {
        residentId,
    })) as IResponse<Apartment>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};
