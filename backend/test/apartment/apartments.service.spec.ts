import { Test, TestingModule } from "@nestjs/testing";
import { ApartmentsService } from "../../src/apartments/apartments.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    mockApartments,
    mockResident,
    getApartmentsTestCases,
    getApartmentTestCases,
    createApartmentTestCases,
    updateApartmentTestCases,
    deleteApartmentTestCases,
    CreateApartmentTestCase,
    GetApartmentTestCase,
    UpdateApartmentTestCase,
    DeleteApartmentTestCase,
    ApartmentTestCase,
} from "./apartments.test-cases";

describe("ApartmentsService", () => {
    let service: ApartmentsService;
    let prisma: any;

    beforeEach(async () => {
        const mockprisma = {
            apartment: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            resident: {
                findUnique: jest.fn(),
            },
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApartmentsService,
                {
                    provide: PrismaService,
                    useValue: mockprisma,
                },
            ],
        }).compile();
        service = module.get<ApartmentsService>(ApartmentsService);
        prisma = module.get(PrismaService);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("getApartments", () => {
        getApartmentsTestCases.forEach((testCase: ApartmentTestCase) => {
            it(testCase.description, async () => {
                const expectedServiceResult = testCase.expectedResult.success
                    ? { code: 1, msg: "Success", data: testCase.expectedResult.data }
                    : { code: 0, msg: testCase.expectedResult.error!.message, data: null };

                prisma.apartment.findMany.mockResolvedValue(testCase.expectedResult.data);
                const result = await service.getApartments();
                expect(result).toEqual(expectedServiceResult);
            });
        });
    });
    describe("getApartment", () => {
        getApartmentTestCases.forEach((testCase: GetApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const expectedServiceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    prisma.apartment.findUnique.mockResolvedValue(testCase.expectedResult.data);
                    const result = await service.getApartment(testCase.id);
                    expect(result).toEqual(expectedServiceResult);
                } else {
                    prisma.apartment.findUnique.mockResolvedValue(null);
                    await expect(service.getApartment(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
    describe("createApartment", () => {
        createApartmentTestCases.forEach((testCase: CreateApartmentTestCase) => {
            it(testCase.description, async () => {
                const expectedServiceResult = {
                    code: 1,
                    msg: "Success",
                    data: testCase.expectedResult.data,
                };

                prisma.apartment.create.mockResolvedValue(testCase.expectedResult.data);
                const result = await service.createApartment(testCase.data);
                expect(result).toEqual(expectedServiceResult);
                expect(prisma.apartment.create).toHaveBeenCalledWith({
                    data: {
                        ...testCase.data,
                        residentId: null,
                    },
                    select: {
                        building: true,
                        resident: true,
                    },
                });
            });
        });
        it("should create an apartment with a resident", async () => {
            const apartmentData = {
                roomNumber: 101,
                buildingId: "building-1",
                area: 75,
            };
            const residentId = "resident-1";
            const mockResident = { id: residentId, fullName: "John Doe" };
            const expectedApartment = {
                id: "apt-1",
                ...apartmentData,
                residentId,
                building: { name: "Building A" },
                resident: mockResident,
            };

            prisma.resident.findUnique.mockResolvedValue(mockResident);
            prisma.apartment.create.mockResolvedValue(expectedApartment);

            const result = await service.createApartment(apartmentData, residentId);

            expect(result.code).toBe(1);
            expect(result.data).toEqual(expectedApartment);
            expect(prisma.resident.findUnique).toHaveBeenCalledWith({
                where: { id: residentId },
            });
            expect(prisma.apartment.create).toHaveBeenCalledWith({
                data: {
                    ...apartmentData,
                    residentId,
                },
                select: {
                    building: true,
                    resident: true,
                },
            });
        });
        it("should throw error when creating apartment with non-existent resident", async () => {
            const apartmentData = {
                roomNumber: 102,
                buildingId: "building-1",
                area: 75,
            };
            const residentId = "non-existent-resident";

            prisma.resident.findUnique.mockResolvedValue(null);

            await expect(service.createApartment(apartmentData, residentId)).rejects.toThrow();
            expect(prisma.resident.findUnique).toHaveBeenCalledWith({
                where: { id: residentId },
            });
        });
    });
    describe("updateApartment", () => {
        updateApartmentTestCases.forEach((testCase: UpdateApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const expectedServiceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    prisma.apartment.findUnique.mockResolvedValue(mockApartments[0]);
                    prisma.apartment.update.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.updateApartment(testCase.id, testCase.data);
                    expect(result).toEqual(expectedServiceResult);
                    expect(prisma.apartment.update).toHaveBeenCalledWith({
                        where: { id: testCase.id },
                        data: testCase.data,
                        select: { resident: true },
                    });
                } else {
                    prisma.apartment.findUnique.mockResolvedValue(null);
                    await expect(service.updateApartment(testCase.id, testCase.data)).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteApartment", () => {
        deleteApartmentTestCases.forEach((testCase: DeleteApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const expectedServiceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    prisma.apartment.findUnique.mockResolvedValue(testCase.expectedResult.data);
                    prisma.apartment.delete.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.deleteApartment(testCase.id);
                    expect(result).toEqual(expectedServiceResult);
                    expect(prisma.apartment.delete).toHaveBeenCalledWith({
                        where: { id: testCase.id },
                    });
                } else {
                    prisma.apartment.findUnique.mockResolvedValue(null);
                    await expect(service.deleteApartment(testCase.id)).rejects.toThrow();
                }
            });
        });
    });

    describe("assignResident", () => {
        it("should assign a resident to an apartment", async () => {
            const apartmentId = "apt-1";
            const residentId = "resident-1";
            const mockApartment = { id: apartmentId, residentId: null };
            const mockResident = { id: residentId, fullName: "John Doe" };
            const mockUpdatedApartment = {
                id: apartmentId,
                residentId,
                building: { name: "Building A" },
                resident: mockResident,
            };

            prisma.apartment.findUnique.mockResolvedValue(mockApartment);
            prisma.resident.findUnique.mockResolvedValue(mockResident);
            prisma.apartment.findFirst.mockResolvedValue(null); // No existing assignment
            prisma.apartment.update.mockResolvedValue(mockUpdatedApartment);

            const result = await service.assignResident(apartmentId, residentId);

            expect(result.code).toBe(1);
            expect(result.data).toEqual(mockUpdatedApartment);
            expect(prisma.apartment.update).toHaveBeenCalledWith({
                where: { id: apartmentId },
                data: { residentId },
                include: {
                    building: true,
                    resident: true,
                },
            });
        });

        it("should unassign a resident from an apartment", async () => {
            const apartmentId = "apt-1";
            const residentId = null;
            const mockApartment = { id: apartmentId, residentId: "existing-resident" };
            const mockUpdatedApartment = {
                id: apartmentId,
                residentId: null,
                building: { name: "Building A" },
                resident: null,
            };

            prisma.apartment.findUnique.mockResolvedValue(mockApartment);
            prisma.apartment.update.mockResolvedValue(mockUpdatedApartment);

            const result = await service.assignResident(apartmentId, residentId);

            expect(result.code).toBe(1);
            expect(result.data).toEqual(mockUpdatedApartment);
            expect(prisma.apartment.update).toHaveBeenCalledWith({
                where: { id: apartmentId },
                data: { residentId: null },
                include: {
                    building: true,
                    resident: true,
                },
            });
        });

        it("should throw error when apartment not found", async () => {
            const apartmentId = "non-existent-apt";
            const residentId = "resident-1";

            prisma.apartment.findUnique.mockResolvedValue(null);

            await expect(service.assignResident(apartmentId, residentId)).rejects.toThrow();
        });

        it("should throw error when resident not found", async () => {
            const apartmentId = "apt-1";
            const residentId = "non-existent-resident";
            const mockApartment = { id: apartmentId, residentId: null };

            prisma.apartment.findUnique.mockResolvedValue(mockApartment);
            prisma.resident.findUnique.mockResolvedValue(null);

            await expect(service.assignResident(apartmentId, residentId)).rejects.toThrow();
        });

        it("should throw error when resident is already assigned to another apartment", async () => {
            const apartmentId = "apt-1";
            const residentId = "resident-1";
            const mockApartment = { id: apartmentId, residentId: null };
            const mockResident = { id: residentId, fullName: "John Doe" };
            const mockExistingAssignment = { id: "apt-2", residentId };

            prisma.apartment.findUnique.mockResolvedValue(mockApartment);
            prisma.resident.findUnique.mockResolvedValue(mockResident);
            prisma.apartment.findFirst.mockResolvedValue(mockExistingAssignment);

            await expect(service.assignResident(apartmentId, residentId)).rejects.toThrow();
        });
    });
});
