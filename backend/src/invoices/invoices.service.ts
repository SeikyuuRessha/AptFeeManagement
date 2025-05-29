import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class InvoicesService {
    constructor(private readonly prisma: PrismaService) {}

    async getInvoices() {
        return handleService(() => this.prisma.invoice.findMany());
    }
    async getInvoice(id: string) {
        return handleService(async () => {
            const invoice = await this.prisma.invoice.findUnique({ where: { id } });
            if (!invoice) {
                throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, { id });
            }
            return invoice;
        });
    }
    async deleteInvoice(id: string) {
        return handleService(async () => {
            const invoice = await this.prisma.invoice.findUnique({ where: { id } });
            if (!invoice) {
                throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, { id });
            }
            return this.prisma.invoice.delete({ where: { id } });
        });
    }
}
