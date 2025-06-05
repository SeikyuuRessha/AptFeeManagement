// interfaces/repositories/payment.repository.interface.ts
import { IReadable } from "./base.repository.interface";

export interface Payment {
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    userId?: string;
    serviceId?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPaymentRepository extends IReadable<Payment> {
    findByUserId(userId: string): Promise<Payment[]>;
    findByServiceId(serviceId: string): Promise<Payment[]>;
    findByStatus(status: Payment["status"]): Promise<Payment[]>;
    findByDateRange(startDate: string, endDate: string): Promise<Payment[]>;
    findByPaymentMethod(method: string): Promise<Payment[]>;
}
