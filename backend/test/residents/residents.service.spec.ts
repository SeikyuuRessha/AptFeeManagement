import { Test, TestingModule } from "@nestjs/testing";
import { ResidentsService } from "../../src/residents/residents.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    mockResidents,
    getResidentsTestCases,
    getResidentTestCases,
    searchResidentsTestCases,
    updateResidentTestCases,
    deleteResidentTestCases,
    setMockPrisma,
} from "./residents.test-cases";

describe("ResidentsService", () => {
    let service: ResidentsService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            resident: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResidentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ResidentsService>(ResidentsService);
        prisma = module.get(PrismaService);

        setMockPrisma(prisma);
    });

    describe("getResidents", () => {
        getResidentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.getResidents();
                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("getResident", () => {
        getResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.getResident(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getResident(testCase.id)).rejects.toThrow();
                }
            });
        });
    });

    describe("search", () => {
        searchResidentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.search(testCase.query);
                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("updateResident", () => {
        updateResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.updateResident(testCase.id, testCase.data as any);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.updateResident(testCase.id, testCase.data as any)).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteResident", () => {
        deleteResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.deleteResident(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.deleteResident(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
});
