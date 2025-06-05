import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface InvoiceDetailTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface CreateInvoiceDetailTestCase extends InvoiceDetailTestCase {
    data: {
        quantity: number;
        invoiceId?: string;
        apartmentId: string;
        subscriptionId: string;
    };
}

export interface GetInvoiceDetailTestCase extends InvoiceDetailTestCase {
    id: string;
}

export interface UpdateInvoiceDetailTestCase extends InvoiceDetailTestCase {
    id: string;
    data: {
        quantity?: number;
    };
}

export interface DeleteInvoiceDetailTestCase extends InvoiceDetailTestCase {
    id: string;
}

// Mock data
export const mockInvoiceDetails = [
    {
        id: "detail-1",
        quantity: 2,
        total: 200000,
        invoiceId: "invoice-1",
        subscriptionId: "sub-1",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
    },
    {
        id: "detail-2",
        quantity: 1,
        total: 100000,
        invoiceId: "invoice-1",
        subscriptionId: "sub-2",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
    },
];

export const mockService = {
    id: "service-1",
    unitPrice: 100000,
    name: "Electricity",
    description: "Monthly electricity service",
};

export const mockInvoice = {
    id: "invoice-1",
    totalAmount: 300000,
    apartmentId: "apt-1",
    status: "PENDING",
    dueDate: new Date("2024-01-01"),
};

export const mockSubscription = {
    id: "sub-1",
    nextBillingDate: new Date("2024-01-01"),
    frequency: "MONTHLY",
    apartmentId: "apt-1",
    serviceId: "service-1",
    service: mockService,
};

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Mock setup helper that will be injected from the test file
let mockPrisma: any;
export const setMockPrisma = (prisma: any) => {
    mockPrisma = prisma;
};

// Test cases for getInvoiceDetails
export const getInvoiceDetailsTestCases: InvoiceDetailTestCase[] = [
    {
        description: "should return all invoice details successfully",
        expectedResult: success(mockInvoiceDetails),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findMany.mockResolvedValue(mockInvoiceDetails);
        },
    },
    {
        description: "should return empty array when no invoice details exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
        },
    },
    {
        description: "should handle database error",
        expectedResult: error(ExceptionCode.INTERNAL_SERVER_ERROR.code, ExceptionCode.INTERNAL_SERVER_ERROR.msg),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findMany.mockRejectedValue(new Error("Database error"));
        },
    },
];

// Test cases for getInvoiceDetail
export const getInvoiceDetailTestCases: GetInvoiceDetailTestCase[] = [
    {
        description: "should return invoice detail successfully when detail exists",
        id: "detail-1",
        expectedResult: success(mockInvoiceDetails[0]),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue(mockInvoiceDetails[0]);
        },
    },
    {
        description: "should return error when invoice detail does not exist",
        id: "non-existent-id",
        expectedResult: error(ExceptionCode.INVOICE_DETAIL_NOT_FOUND.code, ExceptionCode.INVOICE_DETAIL_NOT_FOUND.msg, {
            id: "non-existent-id",
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for createInvoiceDetail
export const createInvoiceDetailTestCases: CreateInvoiceDetailTestCase[] = [
    {
        description: "should create invoice detail successfully with existing invoice",
        data: {
            quantity: 3,
            invoiceId: "invoice-1",
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: success({
            id: "new-detail-id",
            quantity: 3,
            total: 300000,
            invoiceId: "invoice-1",
            subscriptionId: "sub-1",
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findUnique.mockResolvedValueOnce(mockSubscription);
            mockPrisma.invoiceDetail.create.mockResolvedValue({
                id: "new-detail-id",
                quantity: 3,
                total: 300000,
                invoiceId: "invoice-1",
                subscriptionId: "sub-1",
            });
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);
            mockPrisma.subscription.update.mockResolvedValue(mockSubscription);
        },
    },
    {
        description: "should create invoice detail successfully without existing invoice (creates new pending invoice)",
        data: {
            quantity: 2,
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: success({
            id: "new-detail-id",
            quantity: 2,
            total: 200000,
            invoiceId: "new-invoice-id",
            subscriptionId: "sub-1",
        }),
        mockSetup: () => {
            mockPrisma.subscription.findUnique.mockResolvedValueOnce({
                nextBillingDate: new Date("2024-01-15"),
                apartmentId: "apt-1",
                service: { id: "service-1" },
            });
            mockPrisma.invoice.findFirst.mockResolvedValue(null);
            mockPrisma.subscription.findFirst.mockResolvedValueOnce({
                nextBillingDate: new Date("2024-01-15"),
                service: { id: "service-1" },
            });
            mockPrisma.invoice.create.mockResolvedValue({
                id: "new-invoice-id",
                apartmentId: "apt-1",
                status: "PENDING",
                dueDate: new Date("2024-01-15"),
                totalAmount: 0,
            });
            mockPrisma.subscription.findUnique.mockResolvedValueOnce(mockSubscription);
            mockPrisma.invoiceDetail.create.mockResolvedValue({
                id: "new-detail-id",
                quantity: 2,
                total: 200000,
                invoiceId: "new-invoice-id",
                subscriptionId: "sub-1",
            });
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue({});
            mockPrisma.subscription.findFirst.mockResolvedValueOnce(mockSubscription);
            mockPrisma.subscription.update.mockResolvedValue(mockSubscription);
        },
    },
    {
        description: "should create invoice detail with existing pending invoice found",
        data: {
            quantity: 1,
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: success({
            id: "new-detail-id",
            quantity: 1,
            total: 100000,
            invoiceId: "existing-invoice-id",
            subscriptionId: "sub-1",
        }),
        mockSetup: () => {
            // First subscription query for validation
            mockPrisma.subscription.findUnique.mockResolvedValueOnce({
                nextBillingDate: new Date("2024-01-15"),
                apartmentId: "apt-1",
                service: { id: "service-1" },
            });
            // Existing invoice found
            mockPrisma.invoice.findFirst.mockResolvedValue({
                id: "existing-invoice-id",
                apartmentId: "apt-1",
                status: "PENDING",
                dueDate: new Date("2024-01-15"),
                totalAmount: 0,
            });
            // Second subscription query for service info
            mockPrisma.subscription.findUnique.mockResolvedValueOnce(mockSubscription);
            // Create invoice detail
            mockPrisma.invoiceDetail.create.mockResolvedValue({
                id: "new-detail-id",
                quantity: 1,
                total: 100000,
                invoiceId: "existing-invoice-id",
                subscriptionId: "sub-1",
            });
            // Recalculate invoice total
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue({});
            // Update subscription billing date
            mockPrisma.subscription.findFirst.mockResolvedValueOnce(mockSubscription);
            mockPrisma.subscription.update.mockResolvedValue(mockSubscription);
        },
    },
    {
        description: "should return error when invoice not found for provided invoiceId",
        data: {
            quantity: 2,
            invoiceId: "non-existent-invoice",
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: error(ExceptionCode.INVOICE_NOT_FOUND.code, ExceptionCode.INVOICE_NOT_FOUND.msg, {
            invoiceId: "non-existent-invoice",
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should return error when subscription not found",
        data: {
            quantity: 2,
            invoiceId: "invoice-1",
            apartmentId: "apt-1",
            subscriptionId: "non-existent-subscription",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg, {
            subscriptionId: "non-existent-subscription",
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should return error when subscription not found (without invoiceId)",
        data: {
            quantity: 2,
            apartmentId: "apt-1",
            subscriptionId: "non-existent-subscription",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg, {
            subscriptionId: "non-existent-subscription",
        }),
        mockSetup: () => {
            mockPrisma.subscription.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should return error when subscription apartment mismatch",
        data: {
            quantity: 2,
            apartmentId: "wrong-apt-id",
            subscriptionId: "sub-1",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_MISMATCH.code, ExceptionCode.SUBSCRIPTION_MISMATCH.msg, {
            subscriptionId: "sub-1",
            apartmentId: "wrong-apt-id",
            serviceId: "service-1",
        }),
        mockSetup: () => {
            mockPrisma.subscription.findUnique.mockResolvedValue({
                nextBillingDate: new Date("2024-01-15"),
                apartmentId: "correct-apt-id", // Different from request
                service: { id: "service-1" },
            });
        },
    },
    {
        description: "should return error when subscription not found in createPendingInvoice",
        data: {
            quantity: 2,
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg, {
            apartmentId: "apt-1",
            serviceId: "service-1",
        }),
        mockSetup: () => {
            mockPrisma.subscription.findUnique.mockResolvedValueOnce({
                nextBillingDate: new Date("2024-01-15"),
                apartmentId: "apt-1",
                service: { id: "service-1" },
            });
            mockPrisma.invoice.findFirst.mockResolvedValue(null);
            mockPrisma.subscription.findFirst.mockResolvedValueOnce(null);
        },
    },
    {
        description: "should return error when subscription not found for second query",
        data: {
            quantity: 2,
            apartmentId: "apt-1",
            subscriptionId: "sub-1",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg, {
            subscriptionId: "sub-1",
        }),
        mockSetup: () => {
            mockPrisma.subscription.findUnique.mockResolvedValueOnce({
                nextBillingDate: new Date("2024-01-15"),
                apartmentId: "apt-1",
                service: { id: "service-1" },
            });
            mockPrisma.invoice.findFirst.mockResolvedValue({
                id: "existing-invoice-id",
                apartmentId: "apt-1",
                status: "PENDING",
                dueDate: new Date("2024-01-15"),
                totalAmount: 0,
            });
            mockPrisma.subscription.findUnique.mockResolvedValueOnce(null);
        },
    },
];

export const updateInvoiceDetailTestCases: UpdateInvoiceDetailTestCase[] = [
    {
        description: "should update invoice detail successfully when detail exists",
        id: "detail-1",
        data: {
            quantity: 5,
        },
        expectedResult: success({
            ...mockInvoiceDetails[0],
            quantity: 5,
            total: 500000,
        }),
        mockSetup: () => {
            const mockDetailWithRelations = {
                quantity: 2,
                subscription: {
                    service: { unitPrice: 100000, id: "service-1" },
                },
                invoice: { id: "invoice-1", apartmentId: "apt-1" },
            };
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue(mockDetailWithRelations);
            mockPrisma.invoiceDetail.update.mockResolvedValue({
                ...mockInvoiceDetails[0],
                quantity: 5,
                total: 500000,
            });
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);
            mockPrisma.subscription.update.mockResolvedValue(mockSubscription);
        },
    },
    {
        description: "should return error when invoice detail not found for update",
        id: "non-existent-id",
        data: {
            quantity: 3,
        },
        expectedResult: error(ExceptionCode.INVOICE_DETAIL_NOT_FOUND.code, ExceptionCode.INVOICE_DETAIL_NOT_FOUND.msg, {
            id: "non-existent-id",
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for deleteInvoiceDetail
export const deleteInvoiceDetailTestCases: DeleteInvoiceDetailTestCase[] = [
    {
        description: "should delete invoice detail successfully when detail exists",
        id: "detail-1",
        expectedResult: success({
            subscriptionId: "sub-1",
            invoiceId: "invoice-1",
            subscription: {
                service: { id: "service-1" },
            },
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue({
                subscriptionId: "sub-1",
                invoiceId: "invoice-1",
                subscription: {
                    service: { id: "service-1" },
                },
            });
            mockPrisma.invoiceDetail.delete.mockResolvedValue(mockInvoiceDetails[0]);
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);
            mockPrisma.subscription.update.mockResolvedValue(mockSubscription);
        },
    },
    {
        description: "should return error when invoice detail not found for deletion",
        id: "non-existent-id",
        expectedResult: error(ExceptionCode.INVOICE_DETAIL_NOT_FOUND.code, ExceptionCode.INVOICE_DETAIL_NOT_FOUND.msg, {
            id: "non-existent-id",
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should return error when invoice not found after deletion",
        id: "detail-1",
        expectedResult: error(ExceptionCode.INVOICE_NOT_FOUND.code, ExceptionCode.INVOICE_NOT_FOUND.msg, {
            invoiceId: "invoice-1",
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue({
                subscriptionId: "sub-1",
                invoiceId: "invoice-1",
                subscription: {
                    service: { id: "service-1" },
                },
            });
            mockPrisma.invoiceDetail.delete.mockResolvedValue(mockInvoiceDetails[0]);
            mockPrisma.invoice.findUnique.mockResolvedValue(null); // Invoice not found
        },
    },
    {
        description: "should return error when subscription not found in updateSubscriptionNextBillingDate",
        id: "detail-1",
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg, {
            apartmentId: "apt-1",
            serviceId: "service-1",
        }),
        mockSetup: () => {
            mockPrisma.invoiceDetail.findUnique.mockResolvedValue({
                subscriptionId: "sub-1",
                invoiceId: "invoice-1",
                subscription: {
                    service: { id: "service-1" },
                },
            });
            mockPrisma.invoiceDetail.delete.mockResolvedValue(mockInvoiceDetails[0]);
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.invoiceDetail.findMany.mockResolvedValue([]);
            mockPrisma.invoice.update.mockResolvedValue(mockInvoice);
            mockPrisma.subscription.findFirst.mockResolvedValue(null); // Subscription not found
        },
    },
];
