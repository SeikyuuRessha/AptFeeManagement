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
    createApartment(data: CreateApartmentDTO, residentId?: string) {
        return handleService(async () => {
            if (residentId) {
                const resident = await this.prisma.resident.findUnique({
                    where: { id: residentId },
                });

                if (!resident) {
                    throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { residentId });
                }
            }

            return this.prisma.apartment.create({
                data: {
                    ...data,
                    residentId: residentId || null,
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

    assignResident(apartmentId: string, residentId: string | null) {
        return handleService(async () => {
            const apartment = await this.prisma.apartment.findUnique({ where: { id: apartmentId } });
            if (!apartment) {
                throw new AppException(ExceptionCode.APARTMENT_NOT_FOUND, { apartmentId });
            }

            if (residentId) {
                const resident = await this.prisma.resident.findUnique({
                    where: { id: residentId },
                });

                if (!resident) {
                    throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { residentId });
                }

                // Check if resident is already assigned to another apartment
                const existingAssignment = await this.prisma.apartment.findFirst({
                    where: {
                        residentId: residentId,
                        id: { not: apartmentId },
                    },
                });
                if (existingAssignment) {
                    throw new AppException(ExceptionCode.VALIDATION_ERROR, {
                        message: "Resident is already assigned to another apartment",
                        residentId,
                    });
                }
            }

            return this.prisma.apartment.update({
                where: { id: apartmentId },
                data: { residentId },
                include: {
                    building: true,
                    resident: true,
                },
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
