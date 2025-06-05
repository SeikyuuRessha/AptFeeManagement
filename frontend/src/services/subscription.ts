import api from "@/config/api";
import { IResponse } from "./service";

export interface Subscription {
    id: string;
    frequency: string;
    nextBillingDate: string;
    apartmentId: string;
    serviceId: string;
    status: string; // Changed from "active" | "inactive" to string since backend uses string
    createdAt: string;
    updatedAt: string;
}

export const getSubscriptions = async (): Promise<Subscription[]> => {
    const res = (await api.get("/subscriptions")) as IResponse<Subscription[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getSubscription = async (id: string): Promise<Subscription> => {
    const res = (await api.get(
        `/subscriptions/${id}`
    )) as IResponse<Subscription>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const createSubscription = async (
    data: Omit<Subscription, "id" | "createdAt" | "updatedAt" | "status">
): Promise<Subscription> => {
    const res = (await api.post(
        "/subscriptions",
        data
    )) as IResponse<Subscription>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const updateSubscription = async (
    id: string,
    data: Partial<Omit<Subscription, "id" | "createdAt" | "updatedAt">>
): Promise<Subscription> => {
    const res = (await api.put(
        `/subscriptions/${id}`,
        data
    )) as IResponse<Subscription>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const deleteSubscription = async (id: string): Promise<void> => {
    const res = (await api.delete(`/subscriptions/${id}`)) as IResponse<void>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }
};
