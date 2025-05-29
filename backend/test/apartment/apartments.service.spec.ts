import { Test, TestingModule } from "@nestjs/testing";
import { ApartmentsService } from "../../src/apartments/apartments.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AppException } from "../../src/common/exception/app-exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import {
    mockApartments,
    mockResident,
    mockApartmentWithRelations,
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
                    const result = await service.getApartment(testCase.id);
                    expect(result.code).not.toBe(1); // Should return error code
                    expect(result.msg).toContain("not found");
                }
            });
        });
    });
    describe("createApartment", () => {
        createApartmentTestCases.forEach((testCase: CreateApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const expectedServiceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    // Mock valid resident
                    prisma.resident.findUnique.mockResolvedValue(mockResident);
                    prisma.apartment.create.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.createApartment(
                        testCase.data,
                        testCase.residentId
                    );
                    expect(result).toEqual(expectedServiceResult);
                    expect(prisma.apartment.create).toHaveBeenCalledWith({
                        data: {
                            ...testCase.data,
                            residentId: testCase.residentId,
                        },
                        select: {
                            building: true,
                            resident: true,
                        },
                    });
                } else if (testCase.expectedResult.error?.code === "RESIDENT_NOT_FOUND") {
                    prisma.resident.findUnique.mockResolvedValue(null);
                    const result = await service.createApartment(
                        testCase.data,
                        testCase.residentId
                    );
                    expect(result.code).not.toBe(1); // Should return error code
                    expect(result.msg).toContain("not found");
                }
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
                    const result = await service.updateApartment(testCase.id, testCase.data);
                    expect(result.code).not.toBe(1); // Should return error code
                    expect(result.msg).toContain("not found");
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
                    const result = await service.deleteApartment(testCase.id);
                    expect(result.code).not.toBe(1); // Should return error code
                    expect(result.msg).toContain("not found");
                }
            });
        });
    });
});
