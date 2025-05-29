import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceDetailsController } from "../../src/invoice-details/invoice-details.controller";
import { InvoiceDetailsService } from "../../src/invoice-details/invoice-details.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    getInvoiceDetailsTestCases,
    getInvoiceDetailTestCases,
    createInvoiceDetailTestCases,
    updateInvoiceDetailTestCases,
    deleteInvoiceDetailTestCases,
} from "./invoice-details.test-cases";

describe("InvoiceDetailsController", () => {
    let controller: InvoiceDetailsController;
    let service: any;

    beforeEach(async () => {
        const mockInvoiceDetailsService = {
            getInvoiceDetails: jest.fn(),
            getInvoiceDetail: jest.fn(),
            createInvoiceDetail: jest.fn(),
            updateInvoiceDetail: jest.fn(),
            deleteInvoiceDetail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoiceDetailsController],
            providers: [
                {
                    provide: InvoiceDetailsService,
                    useValue: mockInvoiceDetailsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<InvoiceDetailsController>(InvoiceDetailsController);
        service = module.get(InvoiceDetailsService);
    });

    describe("getInvoiceDetails", () => {
        getInvoiceDetailsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getInvoiceDetails.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getInvoiceDetails();

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getInvoiceDetails).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getInvoiceDetail", () => {
        getInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getInvoiceDetail.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getInvoiceDetail(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getInvoiceDetail).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("createInvoiceDetail", () => {
        createInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.createInvoiceDetail.mockResolvedValue(testCase.expectedResult);

                const result = await controller.createInvoiceDetail(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.createInvoiceDetail).toHaveBeenCalledWith(testCase.data);
            });
        });
    });

    describe("updateInvoiceDetail", () => {
        updateInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.updateInvoiceDetail.mockResolvedValue(testCase.expectedResult);

                const result = await controller.updateInvoiceDetail(testCase.id, testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.updateInvoiceDetail).toHaveBeenCalledWith(
                    testCase.id,
                    testCase.data
                );
            });
        });
    });

    describe("deleteInvoiceDetail", () => {
        deleteInvoiceDetailTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.deleteInvoiceDetail.mockResolvedValue(testCase.expectedResult);

                const result = await controller.deleteInvoiceDetail(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.deleteInvoiceDetail).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
