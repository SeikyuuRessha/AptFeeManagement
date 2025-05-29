export interface ApartmentTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        success: boolean;
        data?: any;
        error?: {
            code: string;
            message: string;
        };
    };
}

export interface CreateApartmentTestCase extends ApartmentTestCase {
    data: {
        roomNumber: number;
        area: number;
        buildingId: string;
    };
    residentId: string;
}

export interface GetApartmentTestCase extends ApartmentTestCase {
    id: string;
}

export interface UpdateApartmentTestCase extends ApartmentTestCase {
    id: string;
    data: Partial<{
        roomNumber: number;
        area: number;
        buildingId: string;
    }>;
}

export interface DeleteApartmentTestCase extends ApartmentTestCase {
    id: string;
}

// Mock data
export const mockApartments = [
    {
        id: "apartment-1",
        roomNumber: 101,
        area: 75,
        buildingId: "building-1",
        residentId: "resident-1",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
    },
    {
        id: "apartment-2",
        roomNumber: 102,
        area: 85,
        buildingId: "building-1",
        residentId: "resident-2",
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2023-02-01"),
    },
];

export const mockResident = {
    id: "resident-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
};

export const mockBuilding = {
    id: "building-1",
    name: "Building A",
    address: "123 Main Street",
};

export const mockApartmentWithRelations = {
    ...mockApartments[0],
    building: mockBuilding,
    resident: mockResident,
};

// Helper functions
export const success = (data: any) => ({ success: true, data });
export const error = (code: string, message: string) => ({
    success: false,
    error: { code, message },
});

// Test cases for getApartments
export const getApartmentsTestCases: ApartmentTestCase[] = [
    {
        description: "should return all apartments successfully",
        expectedResult: success(mockApartments),
    },
    {
        description: "should return empty array when no apartments exist",
        expectedResult: success([]),
    },
];

// Test cases for getApartment
export const getApartmentTestCases: GetApartmentTestCase[] = [
    {
        description: "should return apartment successfully when apartment exists",
        id: "apartment-1",
        expectedResult: success(mockApartments[0]),
    },
    {
        description: "should throw APARTMENT_NOT_FOUND when apartment does not exist",
        id: "non-existent-id",
        expectedResult: error("APARTMENT_NOT_FOUND", "Apartment not found"),
    },
];

// Test cases for createApartment
export const createApartmentTestCases: CreateApartmentTestCase[] = [
    {
        description: "should create apartment successfully with valid data and resident",
        data: {
            roomNumber: 103,
            area: 90,
            buildingId: "building-1",
        },
        residentId: "resident-1",
        expectedResult: success(mockApartmentWithRelations),
    },
    {
        description: "should throw RESIDENT_NOT_FOUND when resident does not exist",
        data: {
            roomNumber: 104,
            area: 80,
            buildingId: "building-1",
        },
        residentId: "non-existent-resident",
        expectedResult: error("RESIDENT_NOT_FOUND", "Resident not found"),
    },
];

// Test cases for updateApartment
export const updateApartmentTestCases: UpdateApartmentTestCase[] = [
    {
        description: "should update apartment successfully when apartment exists",
        id: "apartment-1",
        data: {
            roomNumber: 105,
            area: 95,
        },
        expectedResult: success({
            ...mockApartments[0],
            roomNumber: 105,
            area: 95,
            resident: mockResident,
            updatedAt: expect.any(Date),
        }),
    },
    {
        description: "should throw NOT_FOUND when apartment does not exist",
        id: "non-existent-id",
        data: {
            roomNumber: 106,
        },
        expectedResult: error("NOT_FOUND", "Apartment not found"),
    },
];

// Test cases for deleteApartment
export const deleteApartmentTestCases: DeleteApartmentTestCase[] = [
    {
        description: "should delete apartment successfully when apartment exists",
        id: "apartment-1",
        expectedResult: success(mockApartments[0]),
    },
    {
        description: "should throw NOT_FOUND when apartment does not exist",
        id: "non-existent-id",
        expectedResult: error("NOT_FOUND", "Apartment not found"),
    },
];
