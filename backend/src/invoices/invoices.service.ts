import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InvoicesService {
    constructor(private readonly prisma: PrismaService) {}

    async getInvoices() {
        return handleService(() => this.prisma.invoice.findMany());
    }

    async getInvoice(id: string) {
        return handleService(() => this.prisma.invoice.findUnique({ where: { id } }));
    }

    async deleteInvoice(id: string) {
        return handleService(() => this.prisma.invoice.delete({ where: { id } }));
    }
}
