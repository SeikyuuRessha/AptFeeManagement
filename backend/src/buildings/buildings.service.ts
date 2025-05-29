import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { CreateBuildingDTO } from "./dtos/create-building.dto";
import { UpdateBuildingDTO } from "./dtos/update-building.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class BuildingsService {
    constructor(private readonly prisma: PrismaService) {}

    getBuildings() {
        return handleService(() => this.prisma.building.findMany());
    }

    getBuilding(id: string) {
        return handleService(async () => {
            const building = await this.prisma.building.findUnique({ where: { id } });
            if (!building) {
                throw new AppException(ExceptionCode.BUILDING_NOT_FOUND, { id });
            }
            return building;
        });
    }

    createBuilding(data: CreateBuildingDTO) {
        return handleService(() => this.prisma.building.create({ data }));
    }

    deleteBuilding(id: string) {
        return handleService(async () => {
            const building = await this.prisma.building.findUnique({ where: { id } });
            if (!building) {
                throw new AppException(ExceptionCode.BUILDING_NOT_FOUND, { id });
            }
            return this.prisma.building.delete({ where: { id } });
        });
    }
    updateBuilding(id: string, data: UpdateBuildingDTO) {
        return handleService(async () => {
            const existing = await this.prisma.building.findUnique({ where: { id } });
            if (!existing) {
                throw new AppException(ExceptionCode.BUILDING_NOT_FOUND, { id });
            }

            return this.prisma.building.update({
                where: { id },
                data,
            });
        });
    }
}
