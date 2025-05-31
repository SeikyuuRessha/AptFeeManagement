import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceDetailsService } from "../../src/invoice-details/invoice-details.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    setMockPrisma,
    getInvoiceDetailsTestCases,
    getInvoiceDetailTestCases,
    createInvoiceDetailTestCases,
    updateInvoiceDetailTestCases,
    deleteInvoiceDetailTestCases,
} from "./invoice-details.test-cases";

describe("InvoiceDetailsService", () => {
    let service: InvoiceDetailsService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            invoiceDetail: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            invoice: {
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            service: {
                findUnique: jest.fn(),
            },
            subscription: {
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoiceDetailsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<InvoiceDetailsService>(InvoiceDetailsService);
        prisma = module.get(PrismaService);

        // Set the mock prisma for test cases
        setMockPrisma(prisma);
    });
    describe("getInvoiceDetails", () => {
        getInvoiceDetailsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult?.code === 1) {
                    const result = await service.getInvoiceDetails();
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getInvoiceDetails()).rejects.toThrow();
                }
            });
        });
    });
    describe("getInvoiceDetail", () => {
        getInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult?.code === 1) {
                    const result = await service.getInvoiceDetail(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getInvoiceDetail(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
    describe("createInvoiceDetail", () => {
        createInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult?.code === 1) {
                    const result = await service.createInvoiceDetail(testCase.data);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.createInvoiceDetail(testCase.data)).rejects.toThrow();
                }
            });
        });
    });
    describe("updateInvoiceDetail", () => {
        updateInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult?.code === 1) {
                    const result = await service.updateInvoiceDetail(testCase.id, testCase.data);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(
                        service.updateInvoiceDetail(testCase.id, testCase.data)
                    ).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteInvoiceDetail", () => {
        deleteInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult?.code === 1) {
                    const result = await service.deleteInvoiceDetail(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.deleteInvoiceDetail(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
});
