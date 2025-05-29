import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface ServiceTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface CreateServiceTestCase extends ServiceTestCase {
    data: {
        unitPrice: number;
        name: string;
        description: string;
    };
}

export interface GetServiceTestCase extends ServiceTestCase {
    id: string;
}

export interface UpdateServiceTestCase extends ServiceTestCase {
    id: string;
    data: {
        unitPrice?: number;
        name?: string;
        description?: string;
    };
}

export interface DeleteServiceTestCase extends ServiceTestCase {
    id: string;
}

// Mock data
export const mockServices = [
    {
        id: "service-1",
        unitPrice: 100.0,
        name: "Electricity",
        description: "Monthly electricity service",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
    },
    {
        id: "service-2",
        unitPrice: 50.0,
        name: "Water",
        description: "Monthly water service",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
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

// Test cases for getServices
export const getServicesTestCases: ServiceTestCase[] = [
    {
        description: "should return all services successfully",
        expectedResult: success(mockServices),
        mockSetup: () => {
            mockPrisma.service.findMany.mockResolvedValue(mockServices);
        },
    },
    {
        description: "should return empty array when no services exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.service.findMany.mockResolvedValue([]);
        },
    },
];

// Test cases for getService
export const getServiceTestCases: GetServiceTestCase[] = [
    {
        description: "should return service successfully when service exists",
        id: "service-1",
        expectedResult: success(mockServices[0]),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(mockServices[0]);
        },
    },
    {
        description: "should return error when service does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.SERVICE_NOT_FOUND.code,
            ExceptionCode.SERVICE_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for createService
export const createServiceTestCases: CreateServiceTestCase[] = [
    {
        description: "should create service successfully with valid data",
        data: {
            unitPrice: 75.0,
            name: "Internet",
            description: "Monthly internet service",
        },
        expectedResult: success({
            id: "new-service-id",
            unitPrice: 75.0,
            name: "Internet",
            description: "Monthly internet service",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.service.create.mockResolvedValue({
                id: "new-service-id",
                unitPrice: 75.0,
                name: "Internet",
                description: "Monthly internet service",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        },
    },
    {
        description: "should create service with minimal required data",
        data: {
            unitPrice: 25.0,
            name: "Parking",
            description: "Monthly parking fee",
        },
        expectedResult: success({
            id: "new-service-id-2",
            unitPrice: 25.0,
            name: "Parking",
            description: "Monthly parking fee",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.service.create.mockResolvedValue({
                id: "new-service-id-2",
                unitPrice: 25.0,
                name: "Parking",
                description: "Monthly parking fee",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        },
    },
];

// Test cases for updateService
export const updateServiceTestCases: UpdateServiceTestCase[] = [
    {
        description: "should update service successfully when service exists",
        id: "service-1",
        data: {
            unitPrice: 120.0,
            name: "Electricity Premium",
        },
        expectedResult: success({
            ...mockServices[0],
            unitPrice: 120.0,
            name: "Electricity Premium",
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(mockServices[0]);
            mockPrisma.service.update.mockResolvedValue({
                ...mockServices[0],
                unitPrice: 120.0,
                name: "Electricity Premium",
                updatedAt: expect.any(Date),
            });
        },
    },
    {
        description: "should throw SERVICE_NOT_FOUND when service does not exist",
        id: "non-existent-id",
        data: {
            unitPrice: 150.0,
        },
        expectedResult: error(
            ExceptionCode.SERVICE_NOT_FOUND.code,
            ExceptionCode.SERVICE_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for deleteService
export const deleteServiceTestCases: DeleteServiceTestCase[] = [
    {
        description: "should delete service successfully when service exists",
        id: "service-1",
        expectedResult: success(mockServices[0]),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(mockServices[0]);
            mockPrisma.service.delete.mockResolvedValue(mockServices[0]);
        },
    },
    {
        description: "should throw SERVICE_NOT_FOUND when service does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.SERVICE_NOT_FOUND.code,
            ExceptionCode.SERVICE_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.service.findUnique.mockResolvedValue(null);
        },
    },
];
