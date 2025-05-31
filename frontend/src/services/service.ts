import api from "@/config/api";

export interface Service {
    id: string;
    unitPrice: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface IResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export const getServices = async (): Promise<Service[]> => {
    const res = (await api.get("/services")) as IResponse<Service[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getService = async (id: string): Promise<Service> => {
    const res = (await api.get(`/services/${id}`)) as IResponse<Service>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const createService = async (
    data: Omit<Service, "id" | "createdAt" | "updatedAt">
): Promise<Service> => {
    const res = (await api.post("/services", data)) as IResponse<Service>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const updateService = async (
    id: string,
    data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>
): Promise<Service> => {
    const res = (await api.put(`/services/${id}`, data)) as IResponse<Service>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const deleteService = async (id: string): Promise<Service> => {
    const res = (await api.delete(`/services/${id}`)) as IResponse<Service>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};
