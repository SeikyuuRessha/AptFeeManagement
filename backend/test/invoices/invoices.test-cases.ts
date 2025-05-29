// Test cases for Invoices module
import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface InvoiceTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface GetInvoiceTestCase extends InvoiceTestCase {
    id: string;
}

export interface DeleteInvoiceTestCase extends InvoiceTestCase {
    id: string;
}

// Mock data
export const mockInvoices = [
    {
        id: "invoice-1",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
        totalAmount: 250000,
        dueDate: new Date("2024-01-01"),
        status: "PENDING",
        apartmentId: "apt-1",
    },
    {
        id: "invoice-2",
        createdAt: new Date("2023-12-15"),
        updatedAt: new Date("2023-12-15"),
        totalAmount: 180000,
        dueDate: new Date("2024-01-15"),
        status: "PAID",
        apartmentId: "apt-2",
    },
];

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Mock setup helper that will be injected from the test file
let mockPrisma: any;
export const setMockPrisma = (prisma: any) => {
    mockPrisma = prisma;
};

// Test cases for getInvoices
export const getInvoicesTestCases: InvoiceTestCase[] = [
    {
        description: "should return all invoices successfully",
        expectedResult: success(mockInvoices),
        mockSetup: () => {
            mockPrisma.invoice.findMany.mockResolvedValue(mockInvoices);
        },
    },
    {
        description: "should return empty array when no invoices exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.invoice.findMany.mockResolvedValue([]);
        },
    },
    {
        description: "should handle database error",
        expectedResult: error(
            ExceptionCode.INTERNAL_SERVER_ERROR.code,
            ExceptionCode.INTERNAL_SERVER_ERROR.msg
        ),
        mockSetup: () => {
            mockPrisma.invoice.findMany.mockRejectedValue(new Error("Database error"));
        },
    },
];

// Test cases for getInvoice
export const getInvoiceTestCases: GetInvoiceTestCase[] = [
    {
        description: "should return invoice successfully when invoice exists",
        id: "invoice-1",
        expectedResult: success(mockInvoices[0]),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoices[0]);
        },
    },
    {
        description: "should return error when invoice does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.INVOICE_NOT_FOUND.code,
            ExceptionCode.INVOICE_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should handle database error during get",
        id: "invoice-1",
        expectedResult: error(
            ExceptionCode.INTERNAL_SERVER_ERROR.code,
            ExceptionCode.INTERNAL_SERVER_ERROR.msg
        ),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockRejectedValue(new Error("Database error"));
        },
    },
];

// Test cases for deleteInvoice
export const deleteInvoiceTestCases: DeleteInvoiceTestCase[] = [
    {
        description: "should delete invoice successfully when invoice exists",
        id: "invoice-1",
        expectedResult: success(mockInvoices[0]),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoices[0]);
            mockPrisma.invoice.delete.mockResolvedValue(mockInvoices[0]);
        },
    },
    {
        description: "should return error when invoice does not exist for deletion",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.INVOICE_NOT_FOUND.code,
            ExceptionCode.INVOICE_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(null);
        },
    },
    {
        description: "should handle database error during deletion",
        id: "invoice-1",
        expectedResult: error(
            ExceptionCode.INTERNAL_SERVER_ERROR.code,
            ExceptionCode.INTERNAL_SERVER_ERROR.msg
        ),
        mockSetup: () => {
            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoices[0]);
            mockPrisma.invoice.delete.mockRejectedValue(new Error("Database error"));
        },
    },
];
