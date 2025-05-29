import { Test, TestingModule } from "@nestjs/testing";
import { ServicesController } from "../../src/services/services.controller";
import { ServicesService } from "../../src/services/services.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    getServicesTestCases,
    getServiceTestCases,
    createServiceTestCases,
    updateServiceTestCases,
    deleteServiceTestCases,
} from "./services.test-cases";

describe("ServicesController", () => {
    let controller: ServicesController;
    let service: any;

    beforeEach(async () => {
        const mockServicesService = {
            getServices: jest.fn(),
            getService: jest.fn(),
            createService: jest.fn(),
            updateService: jest.fn(),
            deleteService: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
            providers: [
                {
                    provide: ServicesService,
                    useValue: mockServicesService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<ServicesController>(ServicesController);
        service = module.get(ServicesService);
    });

    describe("getServices", () => {
        getServicesTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getServices.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getServices();

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getServices).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("getService", () => {
        getServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getService.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getService(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.getService).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("createService", () => {
        createServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.createService.mockResolvedValue(testCase.expectedResult);

                const result = await controller.createService(testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.createService).toHaveBeenCalledWith(testCase.data);
            });
        });
    });

    describe("updateService", () => {
        updateServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.updateService.mockResolvedValue(testCase.expectedResult);

                const result = await controller.updateService(testCase.id, testCase.data);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.updateService).toHaveBeenCalledWith(testCase.id, testCase.data);
            });
        });
    });

    describe("deleteService", () => {
        deleteServiceTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.deleteService.mockResolvedValue(testCase.expectedResult);

                const result = await controller.deleteService(testCase.id);

                expect(result).toEqual(testCase.expectedResult);
                expect(service.deleteService).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
