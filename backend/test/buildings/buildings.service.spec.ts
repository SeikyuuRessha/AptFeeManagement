import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsService } from "../../src/buildings/buildings.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { buildingTestCases, mockBuildings, success, error } from "./buildings.test-cases";

describe("BuildingsService", () => {
    let service: BuildingsService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            building: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BuildingsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<BuildingsService>(BuildingsService);
        prisma = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    describe("getBuildings", () => {
        it("should return all buildings", async () => {
            (prisma.building.findMany as jest.Mock).mockResolvedValue(mockBuildings);
            const result = await service.getBuildings();
            expect(result).toEqual(success(mockBuildings));
        });
    });
    describe("getBuilding", () => {
        buildingTestCases.getById.forEach(({ name, id, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, id, expected);
                const result = await service.getBuilding(id);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("createBuilding", () => {
        buildingTestCases.create.forEach(({ name, input, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, input, expected);
                const result = await service.createBuilding(input);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("updateBuilding", () => {
        buildingTestCases.update.forEach(
            ({ name, id, input, expected, mockSetup, expectedResult }) => {
                it(name, async () => {
                    mockSetup(prisma, id, input, expected);
                    const result = await service.updateBuilding(id, input);
                    expect(result).toEqual(expectedResult(expected));
                });
            }
        );
    });

    describe("deleteBuilding", () => {
        buildingTestCases.delete.forEach(({ name, id, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, id, expected);
                const result = await service.deleteBuilding(id);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("Error Handling", () => {
        buildingTestCases.errors.forEach(
            ({ name, operation, id, input, mockSetup, expectedError }) => {
                it(name, async () => {
                    mockSetup(prisma);
                    let promise: Promise<any>;
                    switch (operation) {
                        case "getBuilding":
                            promise = service.getBuilding(id);
                            break;
                        case "createBuilding":
                            promise = service.createBuilding(input);
                            break;
                        case "updateBuilding":
                            promise = service.updateBuilding(id, input);
                            break;
                        case "deleteBuilding":
                            promise = service.deleteBuilding(id);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }

                    const result = await promise;
                    expect(result).toEqual(error(expectedError, { id }));
                });
            }
        );
    });
});
