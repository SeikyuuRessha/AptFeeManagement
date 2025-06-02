import { Test, TestingModule } from "@nestjs/testing";
import { InvoicesService } from "../../src/invoices/invoices.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    setMockPrisma,
    getInvoicesTestCases,
    getInvoiceTestCases,
    deleteInvoiceTestCases,
} from "./invoices.test-cases";

describe("InvoicesService", () => {
    let service: InvoicesService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            invoice: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        prisma = module.get(PrismaService);

        // Set the mock prisma for test cases
        setMockPrisma(prisma);
    });
    describe("getInvoices", () => {
        getInvoicesTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.getInvoices();
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getInvoices()).rejects.toThrow();
                }
            });
        });
    });
    describe("getInvoice", () => {
        getInvoiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.getInvoice(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.getInvoice(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteInvoice", () => {
        deleteInvoiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                if (testCase.expectedResult.code === 1) {
                    const result = await service.deleteInvoice(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    await expect(service.deleteInvoice(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
});
