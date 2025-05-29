import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "../../src/payments/payments.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    setMockPrisma,
    getPaymentsTestCases,
    getPaymentTestCases,
    createPaymentTestCases,
} from "./payments.test-cases";

describe("PaymentsService", () => {
    let service: PaymentsService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            payment: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
            },
            invoice: {
                findUnique: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
        prisma = module.get<PrismaService>(PrismaService);
        setMockPrisma(prisma);
    });

    describe("getPayments", () => {
        getPaymentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                testCase.mockSetup?.();

                const result = await service.getPayments();

                expect(result).toEqual(testCase.expectedResult);
                expect(prisma.payment.findMany).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getPayment", () => {
        getPaymentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                testCase.mockSetup?.();

                const result = await service.getPayment(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(prisma.payment.findUnique).toHaveBeenCalledWith({
                    where: { id: testCase.id },
                });
            });
        });
    });

    describe("createPayment", () => {
        createPaymentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                testCase.mockSetup?.();

                const result = await service.createPayment(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(prisma.invoice.findUnique).toHaveBeenCalledWith({
                    where: { id: testCase.data.invoiceId },
                });

                if (testCase.description.includes("successfully")) {
                    expect(prisma.payment.create).toHaveBeenCalledWith({
                        data: testCase.data,
                    });
                }
            });
        });
    });
});
