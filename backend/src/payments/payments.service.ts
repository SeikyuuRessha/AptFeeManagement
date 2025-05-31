import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { CreatePaymentDTO } from "./dtos/create-payment.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) {}

    getPayments() {
        return handleService(() => this.prisma.payment.findMany());
    }

    getPayment(id: string) {
        return handleService(() => this.prisma.payment.findUnique({ where: { id } }));
    }

    async createPayment(data: CreatePaymentDTO) {
        return handleService(async () => {
            const invoice = await this.prisma.invoice.findUnique({
                where: { id: data.invoiceId },
            });

            if (!invoice)
                throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, {
                    invoiceId: data.invoiceId,
                });

            const payment = await this.prisma.payment.create({
                data: {
                    ...data,
                    status: "COMPLETED",
                    paymentDate: new Date(Date.now()),
                },
            });
            await this.prisma.invoice.update({
                where: { id: data.invoiceId },
                data: { status: "PAID" },
            });

            return payment;
        });
    }
}
