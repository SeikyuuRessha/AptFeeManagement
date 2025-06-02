import { Test, TestingModule } from "@nestjs/testing";
import { ContractsService } from "../../src/contracts/contracts.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    mockContracts,
    getContractsTestCases,
    getContractTestCases,
    createContractTestCases,
    updateContractTestCases,
    deleteContractTestCases,
    setMockPrisma,
} from "./contracts.test-cases";

describe("ContractsService", () => {
    let service: ContractsService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            contract: {
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
                ContractsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ContractsService>(ContractsService);
        prisma = module.get(PrismaService);
        // Set the mock prisma for test cases
        setMockPrisma(prisma);
    });

    describe("getContracts", () => {
        getContractsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                } else {
                    prisma.contract.findMany.mockResolvedValue(mockContracts);
                }

                const result = await service.getContracts();
                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("getContract", () => {
        getContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                } else {
                    const contract = mockContracts.find((c) => c.id === testCase.id);
                    prisma.contract.findUnique.mockResolvedValue(contract);
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.getContract(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getContract(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
    describe("createContract", () => {
        createContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                } else {
                    // Default successful creation
                    prisma.resident.findUnique.mockResolvedValue({ id: testCase.residentId });
                    prisma.contract.create.mockResolvedValue({
                        id: "new-contract-id",
                        ...testCase.data,
                        residentId: testCase.residentId,
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    });
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.createContract(testCase.data, testCase.residentId);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.createContract(testCase.data, testCase.residentId)).rejects.toThrow();
                }
            });
        });
    });
    describe("updateContract", () => {
        updateContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                } else {
                    const contract = mockContracts.find((c) => c.id === testCase.id);
                    prisma.contract.findUnique.mockResolvedValue(contract);
                    if (contract) {
                        prisma.contract.update.mockResolvedValue({
                            ...contract,
                            ...testCase.data,
                            updatedAt: expect.any(Date),
                        });
                    }
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.updateContract(testCase.id, testCase.data);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.updateContract(testCase.id, testCase.data)).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteContract", () => {
        deleteContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                } else {
                    const contract = mockContracts.find((c) => c.id === testCase.id);
                    prisma.contract.findUnique.mockResolvedValue(contract);
                    if (contract) {
                        prisma.contract.delete.mockResolvedValue(contract);
                    }
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.deleteContract(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.deleteContract(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
});
