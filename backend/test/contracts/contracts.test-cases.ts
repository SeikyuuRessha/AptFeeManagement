// filepath: d:\Code\ElectronReactApp\backend\test\contracts\contracts.test-cases.ts
// Test cases for Contracts module

import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface ContractTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface CreateContractTestCase extends ContractTestCase {
    data: {
        documentPath: string;
        status: string;
    };
    residentId: string;
}

export interface GetContractTestCase extends ContractTestCase {
    id: string;
}

export interface UpdateContractTestCase extends ContractTestCase {
    id: string;
    data: {
        documentPath?: string;
        status?: string;
    };
}

export interface DeleteContractTestCase extends ContractTestCase {
    id: string;
}

// Mock data
export const mockContracts = [
    {
        id: "contract-1",
        documentPath: "/documents/contract-1.pdf",
        status: "active",
        residentId: "resident-1",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
    },
    {
        id: "contract-2",
        documentPath: "/documents/contract-2.pdf",
        status: "pending",
        residentId: "resident-2",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
];

export const mockResident = {
    id: "resident-1",
    name: "Test Resident",
    email: "resident@example.com",
};

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Mock setup helper that will be injected from the test file
let mockPrisma: any;
export const setMockPrisma = (prisma: any) => {
    mockPrisma = prisma;
};

// Test cases for getContracts
export const getContractsTestCases: ContractTestCase[] = [
    {
        description: "should return all contracts successfully",
        expectedResult: success(mockContracts),
        mockSetup: () => {
            mockPrisma.contract.findMany.mockResolvedValue(mockContracts);
        },
    },
    {
        description: "should return empty array when no contracts exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.contract.findMany.mockResolvedValue([]);
        },
    },
];

// Test cases for getContract
export const getContractTestCases: GetContractTestCase[] = [
    {
        description: "should return contract successfully when contract exists",
        id: "contract-1",
        expectedResult: success(mockContracts[0]),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(mockContracts[0]);
        },
    },
    {
        description: "should return error when contract does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.CONTRACT_NOT_FOUND.code,
            ExceptionCode.CONTRACT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for createContract
export const createContractTestCases: CreateContractTestCase[] = [
    {
        description: "should create contract successfully with valid data",
        data: {
            documentPath: "/documents/new-contract.pdf",
            status: "active",
        },
        residentId: "resident-1",
        expectedResult: success({
            id: "new-contract-id",
            documentPath: "/documents/new-contract.pdf",
            status: "active",
            residentId: "resident-1",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue({ id: "resident-1" });
            mockPrisma.contract.create.mockResolvedValue({
                id: "new-contract-id",
                documentPath: "/documents/new-contract.pdf",
                status: "active",
                residentId: "resident-1",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        },
    },
    {
        description: "should throw RESIDENT_NOT_FOUND when resident does not exist",
        data: {
            documentPath: "/documents/new-contract.pdf",
            status: "active",
        },
        residentId: "non-existent-resident",
        expectedResult: error(
            ExceptionCode.RESIDENT_NOT_FOUND.code,
            ExceptionCode.RESIDENT_NOT_FOUND.msg,
            { residentId: "non-existent-resident" }
        ),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for updateContract
export const updateContractTestCases: UpdateContractTestCase[] = [
    {
        description: "should update contract successfully when contract exists",
        id: "contract-1",
        data: {
            status: "completed",
            documentPath: "/documents/updated-contract.pdf",
        },
        expectedResult: success({
            ...mockContracts[0],
            status: "completed",
            documentPath: "/documents/updated-contract.pdf",
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(mockContracts[0]);
            mockPrisma.contract.update.mockResolvedValue({
                ...mockContracts[0],
                status: "completed",
                documentPath: "/documents/updated-contract.pdf",
                updatedAt: expect.any(Date),
            });
        },
    },
    {
        description: "should throw CONTRACT_NOT_FOUND when contract does not exist",
        id: "non-existent-id",
        data: {
            status: "completed",
        },
        expectedResult: error(
            ExceptionCode.CONTRACT_NOT_FOUND.code,
            ExceptionCode.CONTRACT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for deleteContract
export const deleteContractTestCases: DeleteContractTestCase[] = [
    {
        description: "should delete contract successfully when contract exists",
        id: "contract-1",
        expectedResult: success(mockContracts[0]),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(mockContracts[0]);
            mockPrisma.contract.delete.mockResolvedValue(mockContracts[0]);
        },
    },
    {
        description: "should throw CONTRACT_NOT_FOUND when contract does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.CONTRACT_NOT_FOUND.code,
            ExceptionCode.CONTRACT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.contract.findUnique.mockResolvedValue(null);
        },
    },
];
