import { Test, TestingModule } from "@nestjs/testing";
import { InvoicesController } from "../../src/invoices/invoices.controller";
import { InvoicesService } from "../../src/invoices/invoices.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    mockInvoices,
    getInvoicesTestCases,
    getInvoiceTestCases,
    deleteInvoiceTestCases,
} from "./invoices.test-cases";

describe("InvoicesController", () => {
    let controller: InvoicesController;
    let service: any;

    beforeEach(async () => {
        const mockInvoicesService = {
            getInvoices: jest.fn(),
            getInvoice: jest.fn(),
            deleteInvoice: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoicesController],
            providers: [
                {
                    provide: InvoicesService,
                    useValue: mockInvoicesService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<InvoicesController>(InvoicesController);
        service = module.get(InvoicesService);
    });

    describe("getInvoices", () => {
        getInvoicesTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getInvoices.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getInvoices();

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getInvoices).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getInvoice", () => {
        getInvoiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getInvoice.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getInvoice(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getInvoice).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("deleteInvoice", () => {
        deleteInvoiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.deleteInvoice.mockResolvedValue(testCase.expectedResult);

                const result = await controller.deleteInvoice(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.deleteInvoice).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
