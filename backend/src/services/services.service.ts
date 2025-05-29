import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { CreateServiceDTO } from "./dtos/create-service.dto";
import { UpdateServiceDTO } from "./dtos/update-service.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) {}

    getServices() {
        return handleService(() => this.prisma.service.findMany());
    }
    getService(id: string) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({ where: { id } });
            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND, { id });
            }
            return service;
        });
    }

    createService(data: CreateServiceDTO) {
        return handleService(() => this.prisma.service.create({ data }));
    }
    async updateService(id: string, data: UpdateServiceDTO) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({ where: { id } });
            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND, { id });
            }

            return this.prisma.service.update({
                where: { id },
                data,
            });
        });
    }
    async deleteService(id: string) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({ where: { id } });
            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND, { id });
            }

            return this.prisma.service.delete({ where: { id } });
        });
    }
}
