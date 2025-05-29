import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { CreateNotificationDTO } from "./dtos/create-nofication.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async createNofication(data: CreateNotificationDTO) {
        return handleService(() => this.prisma.notification.create({ data }));
    }

    async getNotifications() {
        return handleService(() => this.prisma.notification.findMany());
    }
    async getNofication(id: string) {
        return handleService(async () => {
            const notification = await this.prisma.notification.findUnique({ where: { id } });
            if (!notification) {
                throw new AppException(ExceptionCode.NOTIFICATION_NOT_FOUND, { id });
            }
            return notification;
        });
    }
}
