import api from "@/config/api";
import { IResponse } from "@/interfaces/response";

export interface FinancialData {
    revenue: {
        monthly: number[];
        labels: string[];
    };
    debt: DebtRecord[];
}

export interface DebtRecord {
    id: string;
    resident: string;
    amount: number;
    months: number;
    apartment: string;
}

export interface ApartmentData {
    occupancy: {
        occupied: number;
        vacant: number;
        maintenance: number;
    };
    types: {
        studio: number;
        oneBedroom: number;
        twoBedroom: number;
        threeBedroom: number;
    };
    revenue: {
        monthly: number[];
        labels: string[];
    };
}

export const getFinancialData = async (): Promise<FinancialData> => {
    const res = (await api.get(
        "/reports/financial"
    )) as IResponse<FinancialData>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getApartmentData = async (): Promise<ApartmentData> => {
    const res = (await api.get(
        "/reports/apartment"
    )) as IResponse<ApartmentData>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export const getDebtReport = async (): Promise<DebtRecord[]> => {
    const res = (await api.get("/reports/debt")) as IResponse<DebtRecord[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};
