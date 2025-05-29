import { Test, TestingModule } from "@nestjs/testing";
import { ServicesService } from "../../src/services/services.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import {
    mockServices,
    setMockPrisma,
    getServicesTestCases,
    getServiceTestCases,
    createServiceTestCases,
    updateServiceTestCases,
    deleteServiceTestCases,
} from "./services.test-cases";

describe("ServicesService", () => {
    let service: ServicesService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            service: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServicesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ServicesService>(ServicesService);
        prisma = module.get(PrismaService);

        // Set the mock prisma for test cases
        setMockPrisma(prisma);
    });

    describe("getServices", () => {
        getServicesTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.getServices();

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("getService", () => {
        getServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.getService(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("createService", () => {
        createServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.createService(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("updateService", () => {
        updateServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.updateService(testCase.id, testCase.data);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("deleteService", () => {
        deleteServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.deleteService(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
});
