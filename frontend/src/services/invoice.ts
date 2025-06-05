import api from "@/config/api";
import { IResponse } from "./service";

export interface Invoice {
    id: string;
    totalAmount: number;
    status: "PENDING" | "COMPLETED" | "OVERDUE";
    dueDate: string;
    apartmentId: string;
    apartment?: {
        id: string;
        number: string;
        building?: {
            name: string;
        };
        resident?: {
            fullName: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    amount: number;
    paymentDate: string;
    method: string;
    invoiceId: string;
    invoice?: Invoice;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceDetail {
    id: string;
    quantity: number;
    total: string; // BigInt serialized as string from backend
    serviceId: string;
    invoiceId: string;
    subscriptionId: string;
    service?: {
        id: string;
        name: string;
        unitPrice: string; // BigInt serialized as string from backend
    };
    subscription?: {
        id: string;
        status: string;
        serviceId: string;
        apartmentId: string;
        service: {
            id: string;
            name: string;
            unitPrice: string; // BigInt serialized as string from backend
            description: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export const getInvoices = async (): Promise<Invoice[]> => {
    const res = (await api.get("/invoices")) as IResponse<Invoice[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getPayments = async (): Promise<Payment[]> => {
    const res = (await api.get("/payments")) as IResponse<Payment[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getInvoiceDetails = async (): Promise<InvoiceDetail[]> => {
    const res = (await api.get("/invoice-details")) as IResponse<
        InvoiceDetail[]
    >;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};
