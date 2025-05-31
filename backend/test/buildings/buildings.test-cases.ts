import { ExceptionCode } from "../../src/common/exception/exception-code";
import { AppException } from "../../src/common/exception/app-exception";

// Mock Data
export const mockBuildings = [
    {
        id: "1",
        name: "Building A",
        address: "123 Main St",
        apartmentCount: 10,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        name: "Building B",
        address: "456 Oak Ave",
        apartmentCount: 5,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
    {
        id: "3",
        name: "Building C",
        address: "789 Pine Ln",
        apartmentCount: 15,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
    },
];

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: any, data: any = null) => ({ code: code.code, msg: code.msg, data });

// Test Case Types
export interface CreateTestCase {
    name: string;
    input: any;
    expected: any;
    mockSetup: (prisma: any, input: any, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface UpdateTestCase {
    name: string;
    id: string;
    input: any;
    expected: any;
    mockSetup: (prisma: any, id: string, input: any, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface DeleteTestCase {
    name: string;
    id: string;
    expected: any;
    mockSetup: (prisma: any, id: string, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface GetByIdTestCase {
    name: string;
    id: string;
    expected: any;
    mockSetup: (prisma: any, id: string, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface ErrorTestCase {
    name: string;
    operation: string;
    id: string;
    input?: any;
    mockSetup: (prisma: any) => void;
    expectedError: any;
    shouldThrow?: boolean;
}

// Test Cases Configuration
export const buildingTestCases = {
    create: [
        {
            name: "should create a building successfully",
            input: { name: "New Building", address: "New Street", apartmentCount: 1 },
            expected: {
                id: "new-id",
                name: "New Building",
                address: "New Street",
                apartmentCount: 1,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01"),
            },
            mockSetup: (prisma: any, input: any, expected: any) => {
                (prisma.building.create as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        {
            name: "should handle creation with large apartment count",
            input: { name: "Large Complex", address: "Complex Street", apartmentCount: 500 },
            expected: {
                id: "large-id",
                name: "Large Complex",
                address: "Complex Street",
                apartmentCount: 500,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01"),
            },
            mockSetup: (prisma: any, input: any, expected: any) => {
                (prisma.building.create as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW CREATE TEST CASES HERE
    ] as CreateTestCase[],

    update: [
        {
            name: "should update existing building",
            id: "1",
            input: { name: "Updated Building", address: "Updated Street", apartmentCount: 12 },
            expected: {
                id: "1",
                name: "Updated Building",
                address: "Updated Street",
                apartmentCount: 12,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01"),
            },
            mockSetup: (prisma: any, id: string, input: any, expected: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(mockBuildings[0]);
                (prisma.building.update as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        {
            name: "should update only name field",
            id: "2",
            input: { name: "New Name Only" },
            expected: {
                id: "2",
                name: "New Name Only",
                address: "456 Oak Ave",
                apartmentCount: 5,
                createdAt: new Date("2024-01-02"),
                updatedAt: new Date("2024-01-02"),
            },
            mockSetup: (prisma: any, id: string, input: any, expected: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(mockBuildings[1]);
                (prisma.building.update as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW UPDATE TEST CASES HERE
    ] as UpdateTestCase[],

    delete: [
        {
            name: "should delete existing building",
            id: "1",
            expected: mockBuildings[0],
            mockSetup: (prisma: any, id: string, expected: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(expected);
                (prisma.building.delete as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW DELETE TEST CASES HERE
    ] as DeleteTestCase[],

    getById: [
        {
            name: "should return building by valid ID",
            id: "1",
            expected: mockBuildings[0],
            mockSetup: (prisma: any, id: string, expected: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW GET BY ID TEST CASES HERE
    ] as GetByIdTestCase[],
    errors: [
        {
            name: "should throw BUILDING_NOT_FOUND when getting non-existent building",
            operation: "getBuilding",
            id: "non-existent",
            mockSetup: (prisma: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(null);
            },
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
            shouldThrow: true,
        },
        {
            name: "should throw BUILDING_NOT_FOUND when updating non-existent building",
            operation: "updateBuilding",
            id: "non-existent",
            input: { name: "Updated" },
            mockSetup: (prisma: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(null);
            },
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
            shouldThrow: true,
        },
        {
            name: "should throw BUILDING_NOT_FOUND when deleting non-existent building",
            operation: "deleteBuilding",
            id: "non-existent",
            mockSetup: (prisma: any) => {
                (prisma.building.findUnique as jest.Mock).mockResolvedValue(null);
            },
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
            shouldThrow: true,
        },
        // ADD NEW ERROR TEST CASES HERE
    ] as ErrorTestCase[],
};
