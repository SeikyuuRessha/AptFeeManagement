import api from "@/config/api";
import { IResponse } from "./service";

export interface Contract {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    documentPath: string;
    residentId: string;
}

export interface CreateContractData {
    documentPath: string;
    status: string;
    residentId: string;
}

export interface UpdateContractData {
    documentPath?: string;
    status?: string;
}

// Get all contracts
export const getContracts = async (): Promise<Contract[]> => {
    const res = (await api.get("/contracts")) as IResponse<Contract[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Get contract by ID
export const getContract = async (id: string): Promise<Contract> => {
    const res = (await api.get(`/contracts/${id}`)) as IResponse<Contract>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Create new contract
export const createContract = async (
    data: CreateContractData
): Promise<Contract> => {
    const res = (await api.post("/contracts", data)) as IResponse<Contract>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Update contract
export const updateContract = async (
    id: string,
    data: UpdateContractData
): Promise<Contract> => {
    const res = (await api.put(
        `/contracts/${id}`,
        data
    )) as IResponse<Contract>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Delete contract
export const deleteContract = async (id: string): Promise<void> => {
    const res = (await api.delete(`/contracts/${id}`)) as IResponse<any>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }
};
