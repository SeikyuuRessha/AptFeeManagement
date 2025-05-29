import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsController } from "../../src/payments/payments.controller";
import { PaymentsService } from "../../src/payments/payments.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    mockPayments,
    getPaymentsTestCases,
    getPaymentTestCases,
    createPaymentTestCases,
} from "./payments.test-cases";

describe("PaymentsController", () => {
    let controller: PaymentsController;
    let service: any;

    beforeEach(async () => {
        const mockPaymentsService = {
            getPayments: jest.fn(),
            getPayment: jest.fn(),
            createPayment: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                {
                    provide: PaymentsService,
                    useValue: mockPaymentsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<PaymentsController>(PaymentsController);
        service = module.get(PaymentsService);
    });

    describe("getPayments", () => {
        getPaymentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getPayments.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getPayments();

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getPayments).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getPayment", () => {
        getPaymentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getPayment.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getPayment(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getPayment).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("createPayment", () => {
        createPaymentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.createPayment.mockResolvedValue(testCase.expectedResult);

                const result = await controller.createPayment(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.createPayment).toHaveBeenCalledWith(testCase.data);
            });
        });
    });
});
