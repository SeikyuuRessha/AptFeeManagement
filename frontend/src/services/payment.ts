import api from "@/config/api";
import { IResponse } from "./service";

export interface Payment {
    id: string;
    amount: string; // Backend trả về BigInt dưới dạng string
    paymentDate: string;
    status: string; // "PENDING", "COMPLETED", "FAILED"
    invoiceId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentData {
    amount: string;
    paymentDate: Date;
    status?: string;
    invoiceId: string;
}

export interface UpdatePaymentData {
    amount?: string;
    paymentDate?: Date;
    status?: string;
}

export const getPayments = async (): Promise<Payment[]> => {
    const res = (await api.get("/payments")) as IResponse<Payment[]>;

    if (res.code !== 1) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getPayment = async (id: string): Promise<Payment> => {
    const res = (await api.get(`/payments/${id}`)) as IResponse<Payment>;

    if (res.code !== 1) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const createPayment = async (
    data: CreatePaymentData
): Promise<Payment> => {
    const res = (await api.post("/payments", data)) as IResponse<Payment>;

    if (res.code !== 1) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const updatePayment = async (
    id: string,
    data: UpdatePaymentData
): Promise<Payment> => {
    const res = (await api.put(`/payments/${id}`, data)) as IResponse<Payment>;

    if (res.code !== 1) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const deletePayment = async (id: string): Promise<void> => {
    const res = (await api.delete(`/payments/${id}`)) as IResponse<void>;

    if (res.code !== 1) {
        throw new Error(res.msg);
    }
};
