import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvoiceDetailDTO } from "./dtos/create-invoice-detail.dto";
import { UpdateInvoiceDetailDTO } from "./dtos/update-invoice-detail.dto";
import { Invoice } from "@prisma/client";
import { PaymentStatus } from "../common/enums";
import calcNextBillingDate from "../common/utils/calcNextBillingDate";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class InvoiceDetailsService {
    constructor(private readonly prisma: PrismaService) {}

    async getInvoiceDetails() {
        return handleService(() => this.prisma.invoiceDetail.findMany());
    }
    async getInvoiceDetail(id: string) {
        return handleService(async () => {
            const invoiceDetail = await this.prisma.invoiceDetail.findUnique({ where: { id } });
            if (!invoiceDetail) {
                throw new AppException(ExceptionCode.INVOICE_DETAIL_NOT_FOUND, { id });
            }
            return invoiceDetail;
        });
    }

    async createInvoiceDetail(data: CreateInvoiceDetailDTO) {
        return handleService(async () => {
            let existingInvoice: Invoice | null = null;

            existingInvoice = await this.prisma.invoice.findUnique({
                where: {
                    id: data.invoiceId,
                },
            });

            if (!existingInvoice) {
                const result = await this.createPendingInvoice(data.apartmentId, data.serviceId);

                existingInvoice = result.data as Invoice;
            }
            const service = await this.prisma.service.findUnique({
                where: {
                    id: data.serviceId,
                },
            });
            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND, {
                    serviceId: data.serviceId,
                });
            }

            const newInvoiceDetail = await this.prisma.invoiceDetail.create({
                data: {
                    quantity: data.quantity,
                    total: Number(service.unitPrice) * data.quantity || 0,
                    serviceId: data.serviceId,
                    invoiceId: data.invoiceId,
                },
            });

            await this.recalculateInvoiceTotal(existingInvoice.id);

            await this.updateSubscriptionNextBillingDate(data.apartmentId, data.serviceId);

            return newInvoiceDetail;
        });
    }

    async updateInvoiceDetail(id: string, data: UpdateInvoiceDetailDTO) {
        return handleService(async () => {
            const invoiceDetail = await this.prisma.invoiceDetail.findUnique({
                where: { id },
                select: {
                    quantity: true,
                    invoice: {
                        select: {
                            id: true,
                            apartmentId: true,
                        },
                    },
                    service: {
                        select: { unitPrice: true, id: true },
                    },
                    serviceId: true,
                },
            });

            if (!invoiceDetail) {
                throw new AppException(ExceptionCode.INVOICE_DETAIL_NOT_FOUND, { id });
            }

            const total = Number(invoiceDetail.service.unitPrice) * invoiceDetail.quantity;

            const updatedInvoiceDetail = await this.prisma.invoiceDetail.update({
                where: { id },
                data: {
                    ...data,
                    total,
                },
            });

            await this.recalculateInvoiceTotal(invoiceDetail.invoice.id);

            await this.updateSubscriptionNextBillingDate(
                invoiceDetail.invoice.id,
                invoiceDetail.serviceId
            );

            return updatedInvoiceDetail;
        });
    }

    async deleteInvoiceDetail(id: string) {
        return handleService(async () => {
            const invoiceDetail = await this.prisma.invoiceDetail.findUnique({
                where: { id },
                select: { serviceId: true, invoiceId: true },
            });

            if (!invoiceDetail) {
                throw new AppException(ExceptionCode.INVOICE_DETAIL_NOT_FOUND, { id });
            }

            await this.prisma.invoiceDetail.delete({
                where: { id },
            });

            const invoice = await this.prisma.invoice.findUnique({
                where: { id: invoiceDetail.invoiceId },
                select: {
                    apartmentId: true,
                },
            });
            if (!invoice) {
                throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, {
                    invoiceId: invoiceDetail.invoiceId,
                });
            }

            await this.recalculateInvoiceTotal(invoiceDetail.invoiceId);

            await this.updateSubscriptionNextBillingDate(
                invoice.apartmentId,
                invoiceDetail.serviceId
            );

            return invoiceDetail;
        });
    }

    private createPendingInvoice(apartmentId: string, serviceId: string) {
        return handleService(async () => {
            const subscription = await this.prisma.subscription.findFirst({
                where: {
                    apartmentId,
                    serviceId,
                },
                select: {
                    nextBillingDate: true,
                    service: { select: { id: true } },
                },
            });

            if (!subscription) {
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                    apartmentId,
                    serviceId,
                });
            }

            const newInvoice = await this.prisma.invoice.create({
                data: {
                    apartmentId,
                    status: "PENDING",
                    dueDate: subscription.nextBillingDate,
                    totalAmount: 0,
                },
            });

            return newInvoice;
        });
    }

    private recalculateInvoiceTotal(invoiceId: string) {
        return handleService(async () => {
            const invoiceDetails = await this.prisma.invoiceDetail.findMany({
                where: { invoiceId },
                select: { quantity: true, total: true },
            });

            const totalAmount = invoiceDetails.reduce(
                (acc, detail) => acc + Number(detail.total),
                0
            );

            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { totalAmount },
            });
        });
    }

    private updateSubscriptionNextBillingDate(apartmentId: string, serviceId: string) {
        return handleService(async () => {
            const subscription = await this.prisma.subscription.findFirst({
                where: {
                    apartmentId,
                    serviceId,
                },
            });

            if (!subscription) {
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                    apartmentId,
                    serviceId,
                });
            }

            const date = calcNextBillingDate(subscription.frequency, subscription.nextBillingDate);

            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: { nextBillingDate: date },
            });
        });
    }
}
