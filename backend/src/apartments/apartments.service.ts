import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { CreateApartmentDTO } from "./dtos/create-apartment.dto";
import { UpdateApartmentDTO } from "./dtos/update-apartment.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class ApartmentsService {
    constructor(private readonly prisma: PrismaService) {}
    createApartment(data: CreateApartmentDTO) {
        return handleService(async () => {
            return this.prisma.apartment.create({
                data: {
                    ...data,
                    residentId: null,
                },
                select: {
                    building: true,
                    resident: true,
                },
            });
        });
    }

    getApartments() {
        return handleService(() => this.prisma.apartment.findMany());
    }

    getApartment(id: string) {
        return handleService(async () => {
            const apartment = await this.prisma.apartment.findUnique({ where: { id } });
            if (!apartment) {
                throw new AppException(ExceptionCode.APARTMENT_NOT_FOUND, { id });
            }
            return apartment;
        });
    }

    updateApartment(id: string, data: UpdateApartmentDTO) {
        return handleService(async () => {
            const apartment = await this.prisma.apartment.findUnique({ where: { id } });
            if (!apartment) {
                throw new AppException(ExceptionCode.NOT_FOUND, { id });
            }
            return this.prisma.apartment.update({
                where: { id },
                data,
                select: { resident: true },
            });
        });
    }

    deleteApartment(id: string) {
        return handleService(async () => {
            const apartment = await this.prisma.apartment.findUnique({ where: { id } });
            if (!apartment) {
                throw new AppException(ExceptionCode.NOT_FOUND, { id });
            }
            return this.prisma.apartment.delete({ where: { id } });
        });
    }
}
