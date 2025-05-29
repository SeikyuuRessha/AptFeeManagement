import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContractDto } from "./dtos/create-contract.dto";
import { UpdateContractDTO } from "./dtos/update-contract.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class ContractsService {
    constructor(private readonly prisma: PrismaService) {}

    getContracts() {
        return handleService(() => this.prisma.contract.findMany());
    }
    getContract(id: string) {
        return handleService(async () => {
            const contract = await this.prisma.contract.findUnique({ where: { id } });
            if (!contract) {
                throw new AppException(ExceptionCode.CONTRACT_NOT_FOUND, { id });
            }
            return contract;
        });
    }
    createContract(data: CreateContractDto, residentId: string) {
        return handleService(async () => {
            const resident = await this.prisma.resident.findUnique({
                where: { id: residentId },
            });

            if (!resident) {
                throw new AppException(ExceptionCode.RESIDENT_NOT_FOUND, { residentId });
            }

            return this.prisma.contract.create({
                data: {
                    ...data,
                    residentId,
                },
            });
        });
    }
    updateContract(id: string, data: UpdateContractDTO) {
        return handleService(async () => {
            const contract = await this.prisma.contract.findUnique({ where: { id } });
            if (!contract) {
                throw new AppException(ExceptionCode.CONTRACT_NOT_FOUND, { id });
            }

            return this.prisma.contract.update({
                where: { id },
                data,
            });
        });
    }
    deleteContract(id: string) {
        return handleService(async () => {
            const contract = await this.prisma.contract.findUnique({ where: { id } });
            if (!contract) {
                throw new AppException(ExceptionCode.CONTRACT_NOT_FOUND, { id });
            }

            return this.prisma.contract.delete({
                where: { id },
            });
        });
    }
}
