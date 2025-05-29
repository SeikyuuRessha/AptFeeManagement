import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSubscriptionDTO } from "./dtos/create-subscription.dto";
import { UpdateSubscriptionDTO } from "./dtos/update-subscription.dto";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) {}

    getSubscriptions() {
        return handleService(() => this.prisma.subscription.findMany());
    }
    getSubscription(id: string) {
        return handleService(async () => {
            const subscription = await this.prisma.subscription.findUnique({ where: { id } });
            if (!subscription) {
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, { id });
            }
            return subscription;
        });
    }
    createSubscription(data: CreateSubscriptionDTO) {
        return handleService(async () => {
            // Validate service exists
            const service = await this.prisma.service.findUnique({
                where: { id: data.serviceId },
            });
            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND, {
                    serviceId: data.serviceId,
                });
            }

            // Validate apartment exists
            const apartment = await this.prisma.apartment.findUnique({
                where: { id: data.apartmentId },
            });
            if (!apartment) {
                throw new AppException(ExceptionCode.APARTMENT_NOT_FOUND, {
                    apartmentId: data.apartmentId,
                });
            }

            return this.prisma.subscription.create({
                data: {
                    ...data,
                    status: "active",
                },
            });
        });
    }
    updateSubscription(id: string, data: UpdateSubscriptionDTO) {
        return handleService(async () => {
            const subscription = await this.prisma.subscription.findUnique({ where: { id } });
            if (!subscription) {
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, { id });
            }

            return this.prisma.subscription.update({ where: { id }, data });
        });
    }
    deleteSubscription(id: string) {
        return handleService(async () => {
            const subscription = await this.prisma.subscription.findUnique({ where: { id } });
            if (!subscription) {
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, { id });
            }

            return this.prisma.subscription.delete({ where: { id } });
        });
    }
}
