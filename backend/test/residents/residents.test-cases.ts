// Test cases for Residents module
import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface ResidentTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface GetResidentTestCase extends ResidentTestCase {
    id: string;
}

export interface SearchResidentsTestCase extends ResidentTestCase {
    query: string;
}

export interface UpdateResidentTestCase extends ResidentTestCase {
    id: string;
    data: {
        fullName?: string;
        email?: string;
        password?: string;
        phone?: string;
        role?: string;
    };
}

export interface DeleteResidentTestCase extends ResidentTestCase {
    id: string;
}

// Mock data
export const mockResidents = [
    {
        id: "resident-1",
        fullName: "John Doe",
        email: "john.doe@example.com",
        password: "hashedpassword123",
        phone: "+1234567890",
        role: "user",
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
    },
    {
        id: "resident-2",
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        password: "hashedpassword456",
        phone: "+0987654321",
        role: "user",
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

// Test cases for getResidents
export const getResidentsTestCases: ResidentTestCase[] = [
    {
        description: "should return all residents successfully",
        expectedResult: success(mockResidents),
        mockSetup: () => {
            mockPrisma.resident.findMany.mockResolvedValue(mockResidents);
        },
    },
    {
        description: "should return empty array when no residents exist",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.resident.findMany.mockResolvedValue([]);
        },
    },
];

// Test cases for getResident
export const getResidentTestCases: GetResidentTestCase[] = [
    {
        description: "should return resident successfully when resident exists",
        id: "resident-1",
        expectedResult: success(mockResidents[0]),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(mockResidents[0]);
        },
    },
    {
        description: "should return error when resident does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.RESIDENT_NOT_FOUND.code,
            ExceptionCode.RESIDENT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for search
export const searchResidentsTestCases: SearchResidentsTestCase[] = [
    {
        description: "should return residents matching search query by name",
        query: "John",
        expectedResult: success([mockResidents[0]]),
        mockSetup: () => {
            mockPrisma.resident.findMany.mockResolvedValue([mockResidents[0]]);
        },
    },
    {
        description: "should return residents matching search query by email",
        query: "jane.smith",
        expectedResult: success([mockResidents[1]]),
        mockSetup: () => {
            mockPrisma.resident.findMany.mockResolvedValue([mockResidents[1]]);
        },
    },
    {
        description: "should return empty array when no residents match search query",
        query: "nonexistent",
        expectedResult: success([]),
        mockSetup: () => {
            mockPrisma.resident.findMany.mockResolvedValue([]);
        },
    },
];

// Test cases for updateResident
export const updateResidentTestCases: UpdateResidentTestCase[] = [
    {
        description: "should update resident successfully when resident exists",
        id: "resident-1",
        data: {
            fullName: "John Updated",
            phone: "+1111111111",
        },
        expectedResult: success({
            ...mockResidents[0],
            fullName: "John Updated",
            phone: "+1111111111",
            updatedAt: expect.any(Date),
        }),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(mockResidents[0]);
            mockPrisma.resident.update.mockResolvedValue({
                ...mockResidents[0],
                fullName: "John Updated",
                phone: "+1111111111",
                updatedAt: expect.any(Date),
            });
        },
    },
    {
        description: "should throw RESIDENT_NOT_FOUND when resident does not exist",
        id: "non-existent-id",
        data: {
            fullName: "Updated Name",
        },
        expectedResult: error(
            ExceptionCode.RESIDENT_NOT_FOUND.code,
            ExceptionCode.RESIDENT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(null);
        },
    },
];

// Test cases for deleteResident
export const deleteResidentTestCases: DeleteResidentTestCase[] = [
    {
        description: "should delete resident successfully when resident exists",
        id: "resident-1",
        expectedResult: success(mockResidents[0]),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(mockResidents[0]);
            mockPrisma.resident.delete.mockResolvedValue(mockResidents[0]);
        },
    },
    {
        description: "should throw RESIDENT_NOT_FOUND when resident does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.RESIDENT_NOT_FOUND.code,
            ExceptionCode.RESIDENT_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
        mockSetup: () => {
            mockPrisma.resident.findUnique.mockResolvedValue(null);
        },
    },
];
