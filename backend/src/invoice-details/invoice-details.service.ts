import { Injectable } from "@nestjs/common";
import { handleService } from "../common/utils/handleService";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvoiceDetailDTO } from "./dtos/create-invoice-detail.dto";
import { UpdateInvoiceDetailDTO } from "./dtos/update-invoice-detail.dto";
import { Invoice } from "@prisma/client";
import calcNextBillingDate from "../common/utils/calcNextBillingDate";
import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class InvoiceDetailsService {
    constructor(private readonly prisma: PrismaService) {}
    async getInvoiceDetails() {
        return handleService(() =>
            this.prisma.invoiceDetail.findMany({
                include: {
                    subscription: {
                        include: {
                            service: true,
                        },
                    },
                },
            })
        );
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
            let targetInvoice: Invoice | null = null;

            if (data.invoiceId) {
                targetInvoice = await this.prisma.invoice.findUnique({
                    where: { id: data.invoiceId },
                });

                if (!targetInvoice)
                    throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, {
                        invoiceId: data.invoiceId,
                    });
            } else {
                // Get subscription to determine next billing date
                const subscription = await this.prisma.subscription.findUnique({
                    where: { id: data.subscriptionId },
                    select: {
                        nextBillingDate: true,
                        apartmentId: true,
                        service: {
                            select: { id: true },
                        },
                    },
                });

                if (!subscription)
                    throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                        subscriptionId: data.subscriptionId,
                    });

                if (subscription.apartmentId !== data.apartmentId)
                    throw new AppException(ExceptionCode.SUBSCRIPTION_MISMATCH, {
                        subscriptionId: data.subscriptionId,
                        apartmentId: data.apartmentId,
                        serviceId: subscription.service.id,
                    });

                // Look for existing invoice for this apartment and next billing month
                const nextBillingDate = new Date(subscription.nextBillingDate);
                const startOfMonth = new Date(nextBillingDate.getFullYear(), nextBillingDate.getMonth(), 1);
                const endOfMonth = new Date(
                    nextBillingDate.getFullYear(),
                    nextBillingDate.getMonth() + 1,
                    0,
                    23,
                    59,
                    59
                );

                targetInvoice = await this.prisma.invoice.findFirst({
                    where: {
                        apartmentId: data.apartmentId,
                        dueDate: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                        status: "PENDING",
                    },
                });

                // If no existing invoice found, create a new one
                if (!targetInvoice) {
                    const result = await this.createPendingInvoice(data.apartmentId, subscription.service.id);
                    targetInvoice = result.data as Invoice;
                }
            }

            // Get service information through subscription
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: data.subscriptionId },
                include: { service: true },
            });

            if (!subscription)
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                    subscriptionId: data.subscriptionId,
                });

            const newInvoiceDetail = await this.prisma.invoiceDetail.create({
                data: {
                    quantity: data.quantity,
                    total: data.quantity ? Number(subscription.service.unitPrice) * data.quantity : 0,
                    invoiceId: targetInvoice.id,
                    subscriptionId: data.subscriptionId,
                },
            });

            await this.recalculateInvoiceTotal(targetInvoice.id);
            await this.updateSubscriptionNextBillingDate(data.apartmentId, subscription.service.id);

            return newInvoiceDetail;
        });
    }
    async updateInvoiceDetail(id: string, data: UpdateInvoiceDetailDTO) {
        return handleService(async () => {
            const invoiceDetail = await this.prisma.invoiceDetail.findUnique({
                where: { id },
                include: {
                    subscription: {
                        include: { service: true },
                    },
                    invoice: {
                        select: {
                            id: true,
                            apartmentId: true,
                        },
                    },
                },
            });

            if (!invoiceDetail) throw new AppException(ExceptionCode.INVOICE_DETAIL_NOT_FOUND, { id });

            const newQuantity = data.quantity || invoiceDetail.quantity;
            const total = Number(invoiceDetail.subscription.service.unitPrice) * newQuantity;

            const updatedInvoiceDetail = await this.prisma.invoiceDetail.update({
                where: { id },
                data: {
                    ...data,
                    total,
                },
            });

            await this.recalculateInvoiceTotal(invoiceDetail.invoice.id);
            await this.updateSubscriptionNextBillingDate(
                invoiceDetail.invoice.apartmentId,
                invoiceDetail.subscription.service.id
            );

            return updatedInvoiceDetail;
        });
    }
    async deleteInvoiceDetail(id: string) {
        return handleService(async () => {
            const invoiceDetail = await this.prisma.invoiceDetail.findUnique({
                where: { id },
                include: {
                    subscription: {
                        include: { service: true },
                    },
                },
            });

            if (!invoiceDetail) throw new AppException(ExceptionCode.INVOICE_DETAIL_NOT_FOUND, { id });

            await this.prisma.invoiceDetail.delete({
                where: { id },
            });

            const invoice = await this.prisma.invoice.findUnique({
                where: { id: invoiceDetail.invoiceId },
                select: {
                    apartmentId: true,
                },
            });

            if (!invoice)
                throw new AppException(ExceptionCode.INVOICE_NOT_FOUND, {
                    invoiceId: invoiceDetail.invoiceId,
                });

            await this.recalculateInvoiceTotal(invoiceDetail.invoiceId);
            await this.updateSubscriptionNextBillingDate(invoice.apartmentId, invoiceDetail.subscription.service.id);

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

            if (!subscription)
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                    apartmentId,
                    serviceId,
                });

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

            const totalAmount = invoiceDetails.reduce((acc, detail) => acc + Number(detail.total), 0);

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

            if (!subscription)
                throw new AppException(ExceptionCode.SUBSCRIPTION_NOT_FOUND, {
                    apartmentId,
                    serviceId,
                });

            const date = calcNextBillingDate(subscription.frequency, subscription.nextBillingDate);

            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: { nextBillingDate: date },
            });
        });
    }
}
