import { ExceptionCode } from "../../src/common/exception/exception-code";
import { AppException } from "../../src/common/exception/app-exception";

export interface PaymentTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult?: {
        code: number;
        msg: string;
        data?: any;
    };
    shouldThrow?: boolean;
    expectedError?: AppException;
}

export interface GetPaymentTestCase extends PaymentTestCase {
    id: string;
}

export interface CreatePaymentTestCase extends PaymentTestCase {
    data: {
        amount: number;
        paymentDate: Date;
        status: "PENDING" | "COMPLETED" | "FAILED";
        invoiceId: string;
    };
}

// Mock data
export const mockPayments = [
    {
        id: "payment-1",
        amount: 250000,
        paymentDate: new Date("2023-12-15"),
        status: "COMPLETED",
        invoiceId: "invoice-1",
        createdAt: new Date("2023-12-15"),
        updatedAt: new Date("2023-12-15"),
    },
    {
        id: "payment-2",
        amount: 180000,
        paymentDate: new Date("2023-12-20"),
        status: "PENDING",
        invoiceId: "invoice-2",
        createdAt: new Date("2023-12-20"),
        updatedAt: new Date("2023-12-20"),
    },
];

export const mockInvoice = {
    id: "invoice-1",
    totalAmount: 250000,
    apartmentId: "apt-1",
    status: "PENDING",
    dueDate: new Date("2024-01-01"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01"),
};

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Mock setup helper that will be injected from the test file
let mockPrisma: any;
export const setMockPrisma = (prisma: any) => {
    mockPrisma = prisma;
};

// Test cases for getPayments
export const getPaymentsTestCases: PaymentTestCase[] = [
    {
        description: "should return all payments successfully",
        expectedResult: success(mockPayments),
        mockSetup: () => {
            mockPrisma.payment.findMany.mockResolvedValue(mockPayments);
        },
    },
    {
        description: "should return empty array when no payments exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.payment.findMany.mockResolvedValue([]);
        },
    },
    {
        description: "should handle database error",
        shouldThrow: true,
        expectedError: new AppException(ExceptionCode.INTERNAL_SERVER_ERROR),
        mockSetup: () => {
            mockPrisma.payment.findMany.mockRejectedValue(new Error("Database error"));
        },
    },
];

// Test cases for getPayment
export const getPaymentTestCases: GetPaymentTestCase[] = [
    {
        description: "should return payment successfully when payment exists",
        id: "payment-1",
        expectedResult: success(mockPayments[0]),
        mockSetup: () => {
            mockPrisma.payment.findUnique.mockResolvedValue(mockPayments[0]);
        },
    },
    {
        description: "should return error when payment does not exist",
        id: "non-existent-id",
        shouldThrow: true,
        expectedError: new AppException(ExceptionCode.PAYMENT_NOT_FOUND, { id: "non-existent-id" }),
        mockSetup: () => {
            mockPrisma.payment.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should handle database error during get",
        id: "payment-1",
        shouldThrow: true,
        expectedError: new AppException(ExceptionCode.INTERNAL_SERVER_ERROR),
        mockSetup: () => {
            mockPrisma.payment.findUnique.mockRejectedValue(new Error("Database error"));
        },
    },
];

// Test cases for createPayment
export const createPaymentTestCases: CreatePaymentTestCase[] = [
    {
        description: "should create payment successfully with valid data",
        data: {
            amount: 300000,
            paymentDate: new Date("2023-12-25"),
            status: "COMPLETED",
            invoiceId: "invoice-1",
        },
        expectedResult: success({
            id: "new-payment-id",
            amount: 300000,
            paymentDate: new Date("2023-12-25"),
            status: "COMPLETED",
            invoiceId: "invoice-1",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.payment.create.mockResolvedValue({
                id: "new-payment-id",
                amount: 300000,
                paymentDate: new Date("2023-12-25"),
                status: "COMPLETED",
                invoiceId: "invoice-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },
    },
    {
        description: "should create payment successfully with default status",
        data: {
            amount: 150000,
            paymentDate: new Date("2023-12-26"),
            status: "PENDING",
            invoiceId: "invoice-1",
        },
        expectedResult: success({
            id: "new-payment-id-2",
            amount: 150000,
            paymentDate: new Date("2023-12-26"),
            status: "PENDING",
            invoiceId: "invoice-1",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.payment.create.mockResolvedValue({
                id: "new-payment-id-2",
                amount: 150000,
                paymentDate: new Date("2023-12-26"),
                status: "PENDING",
                invoiceId: "invoice-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },
    },
    {
        description: "should return error when invoice does not exist",
        data: {
            amount: 200000,
            paymentDate: new Date("2023-12-27"),
            status: "PENDING",
            invoiceId: "non-existent-invoice",
        },
        shouldThrow: true,
        expectedError: new AppException(ExceptionCode.INVOICE_NOT_FOUND, {
            invoiceId: "non-existent-invoice",
        }),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should handle database error during creation",
        data: {
            amount: 100000,
            paymentDate: new Date("2023-12-28"),
            status: "PENDING",
            invoiceId: "invoice-1",
        },
        shouldThrow: true,
        expectedError: new AppException(ExceptionCode.INTERNAL_SERVER_ERROR),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.payment.create.mockRejectedValue(new Error("Database error"));
        },
    },
];
