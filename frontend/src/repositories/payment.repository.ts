// repositories/payment.repository.ts
import { BaseApiService } from "@/services/api/base.api";
import {
    IPaymentRepository,
    Payment,
} from "@/interfaces/repositories/payment.repository.interface";
import { NetworkError } from "@/core/error-handling";

export class PaymentRepository
    extends BaseApiService
    implements IPaymentRepository
{
    constructor() {
        super("/payments");
    }

    async findAll(): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>("");
        } catch (error) {
            throw new NetworkError("Failed to fetch payments", error);
        }
    }

    async findById(id: string): Promise<Payment | null> {
        try {
            return await this.get<Payment>(`/${id}`);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return null;
            }
            throw new NetworkError(
                `Failed to fetch payment with id ${id}`,
                error
            );
        }
    }

    async findByUserId(userId: string): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>(`?userId=${userId}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch payments for user ${userId}`,
                error
            );
        }
    }

    async findByServiceId(serviceId: string): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>(`?serviceId=${serviceId}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch payments for service ${serviceId}`,
                error
            );
        }
    }

    async findByStatus(status: Payment["status"]): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>(`?status=${status}`);
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch payments with status ${status}`,
                error
            );
        }
    }

    async findByDateRange(
        startDate: string,
        endDate: string
    ): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>(
                `?startDate=${startDate}&endDate=${endDate}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch payments in date range ${startDate} - ${endDate}`,
                error
            );
        }
    }

    async findByPaymentMethod(method: string): Promise<Payment[]> {
        try {
            return await this.get<Payment[]>(
                `?paymentMethod=${encodeURIComponent(method)}`
            );
        } catch (error) {
            throw new NetworkError(
                `Failed to fetch payments by method: ${method}`,
                error
            );
        }
    }

    private isNotFoundError(error: any): boolean {
        return error?.response?.status === 404;
    }
}
