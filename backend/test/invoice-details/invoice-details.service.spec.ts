import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceDetailsService } from "../../src/invoice-details/invoice-details.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import {
    mockInvoiceDetails,
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
                create: jest.fn(),
                update: jest.fn(),
            },
            service: {
                findUnique: jest.fn(),
            },
            subscription: {
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

                const result = await service.getInvoiceDetails();

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });

    describe("getInvoiceDetail", () => {
        getInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.getInvoiceDetail(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });

    describe("createInvoiceDetail", () => {
        createInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.createInvoiceDetail(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });

    describe("updateInvoiceDetail", () => {
        updateInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.updateInvoiceDetail(testCase.id, testCase.data);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });

    describe("deleteInvoiceDetail", () => {
        deleteInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                if (testCase.mockSetup) {
                    testCase.mockSetup();
                }

                const result = await service.deleteInvoiceDetail(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
});
