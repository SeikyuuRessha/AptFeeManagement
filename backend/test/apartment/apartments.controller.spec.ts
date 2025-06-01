import { Test, TestingModule } from "@nestjs/testing";
import { ApartmentsController } from "../../src/apartments/apartments.controller";
import { ApartmentsService } from "../../src/apartments/apartments.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    getApartmentsTestCases,
    getApartmentTestCases,
    createApartmentTestCases,
    updateApartmentTestCases,
    deleteApartmentTestCases,
    CreateApartmentTestCase,
    GetApartmentTestCase,
    UpdateApartmentTestCase,
    DeleteApartmentTestCase,
    ApartmentTestCase,
} from "./apartments.test-cases";

describe("ApartmentsController", () => {
    let controller: ApartmentsController;
    let apartmentsService: jest.Mocked<ApartmentsService>;

    beforeEach(async () => {
        const mockApartmentsService = {
            getApartments: jest.fn(),
            getApartment: jest.fn(),
            createApartment: jest.fn(),
            updateApartment: jest.fn(),
            deleteApartment: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ApartmentsController],
            providers: [
                {
                    provide: ApartmentsService,
                    useValue: mockApartmentsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<ApartmentsController>(ApartmentsController);
        apartmentsService = module.get(ApartmentsService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    describe("getApartments", () => {
        getApartmentsTestCases.forEach((testCase: ApartmentTestCase) => {
            it(testCase.description, async () => {
                const serviceResult = testCase.expectedResult.success
                    ? { code: 1, msg: "Success", data: testCase.expectedResult.data }
                    : { code: 0, msg: testCase.expectedResult.error!.message, data: null };

                apartmentsService.getApartments.mockResolvedValue(serviceResult);
                const result = await controller.getApartments();
                expect(result).toEqual(serviceResult);
                expect(apartmentsService.getApartments).toHaveBeenCalled();
            });
        });
    });
    describe("getApartment", () => {
        getApartmentTestCases.forEach((testCase: GetApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const serviceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    apartmentsService.getApartment.mockResolvedValue(serviceResult);
                    const result = await controller.getApartment(testCase.id);
                    expect(result).toEqual(serviceResult);
                } else {
                    apartmentsService.getApartment.mockRejectedValue(new Error(testCase.expectedResult.error!.message));
                    await expect(controller.getApartment(testCase.id)).rejects.toThrow();
                }
                expect(apartmentsService.getApartment).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
    describe("createApartment", () => {
        createApartmentTestCases.forEach((testCase: CreateApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const serviceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    apartmentsService.createApartment.mockResolvedValue(serviceResult);
                    const result = await controller.createApartment(testCase.data);
                    expect(result).toEqual(serviceResult);
                } else {
                    apartmentsService.createApartment.mockRejectedValue(
                        new Error(testCase.expectedResult.error!.message)
                    );
                    await expect(controller.createApartment(testCase.data)).rejects.toThrow();
                }
                expect(apartmentsService.createApartment).toHaveBeenCalledWith(testCase.data);
            });
        });
    });
    describe("updateApartment", () => {
        updateApartmentTestCases.forEach((testCase: UpdateApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const serviceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    apartmentsService.updateApartment.mockResolvedValue(serviceResult);
                    const result = await controller.updateApartment(testCase.id, testCase.data);
                    expect(result).toEqual(serviceResult);
                } else {
                    apartmentsService.updateApartment.mockRejectedValue(
                        new Error(testCase.expectedResult.error!.message)
                    );
                    await expect(controller.updateApartment(testCase.id, testCase.data)).rejects.toThrow();
                }
                expect(apartmentsService.updateApartment).toHaveBeenCalledWith(testCase.id, testCase.data);
            });
        });
    });
    describe("deleteApartment", () => {
        deleteApartmentTestCases.forEach((testCase: DeleteApartmentTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.success) {
                    const serviceResult = {
                        code: 1,
                        msg: "Success",
                        data: testCase.expectedResult.data,
                    };
                    apartmentsService.deleteApartment.mockResolvedValue(serviceResult);
                    const result = await controller.deleteApartment(testCase.id);
                    expect(result).toEqual(serviceResult);
                } else {
                    apartmentsService.deleteApartment.mockRejectedValue(
                        new Error(testCase.expectedResult.error!.message)
                    );
                    await expect(controller.deleteApartment(testCase.id)).rejects.toThrow();
                }
                expect(apartmentsService.deleteApartment).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
