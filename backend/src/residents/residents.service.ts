import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateResidentDTO } from "./dtos/update-resident.dto";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class ResidentsService {
    constructor(private readonly prisma: PrismaService) {}

    async getResidents() {
        return handleService(() => this.prisma.resident.findMany());
    }
    async getResident(id: string) {
        return handleService(async () => {
            const resident = await this.prisma.resident.findUnique({ where: { id } });
            if (!resident) {
                throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { id });
            }
            return resident;
        });
    }

    async search(query: string) {
        return handleService(() =>
            this.prisma.resident.findMany({
                where: {
                    OR: [
                        { fullName: { contains: query } },
                        { email: { contains: query } },
                        { phone: { contains: query } },
                    ],
                },
            })
        );
    }
    async updateResident(id: string, data: UpdateResidentDTO) {
        return handleService(async () => {
            const resident = await this.prisma.resident.findUnique({ where: { id } });
            if (!resident) {
                throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { id });
            }
            return this.prisma.resident.update({ where: { id }, data });
        });
    }
    async deleteResident(id: string) {
        return handleService(async () => {
            const resident = await this.prisma.resident.findUnique({ where: { id } });
            if (!resident) {
                throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { id });
            }
            return this.prisma.resident.delete({ where: { id } });
        });
    }
}
