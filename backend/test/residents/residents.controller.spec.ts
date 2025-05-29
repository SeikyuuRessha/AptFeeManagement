import { Test, TestingModule } from "@nestjs/testing";
import { ResidentsController } from "../../src/residents/residents.controller";
import { ResidentsService } from "../../src/residents/residents.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    mockResidents,
    getResidentsTestCases,
    getResidentTestCases,
    searchResidentsTestCases,
    updateResidentTestCases,
    deleteResidentTestCases,
} from "./residents.test-cases";

describe("ResidentsController", () => {
    let controller: ResidentsController;
    let service: any;

    beforeEach(async () => {
        const mockResidentsService = {
            getResidents: jest.fn(),
            getResident: jest.fn(),
            search: jest.fn(),
            updateResident: jest.fn(),
            deleteResident: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ResidentsController],
            providers: [
                {
                    provide: ResidentsService,
                    useValue: mockResidentsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<ResidentsController>(ResidentsController);
        service = module.get(ResidentsService);
    });

    describe("getAllResidents", () => {
        getResidentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getResidents.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getAllResidents();
                expect(result).toEqual(testCase.expectedResult);
                expect(service.getResidents).toHaveBeenCalled();
            });
        });
    });

    describe("getResidentById", () => {
        getResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getResident.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getResidentById(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.getResident).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("getMyProfile", () => {
        it("should return current user profile successfully", async () => {
            const mockRequest = {
                user: { sub: "resident-1" },
            } as any;
            const expectedResult = { code: 1, msg: "Success", data: mockResidents[0] };

            service.getResident.mockResolvedValue(expectedResult);

            const result = await controller.getMyProfile(mockRequest);
            expect(result).toEqual(expectedResult);
            expect(service.getResident).toHaveBeenCalledWith("resident-1");
        });
    });

    describe("searchResidents", () => {
        searchResidentsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.search.mockResolvedValue(testCase.expectedResult);

                const result = await controller.searchResidents(testCase.query);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.search).toHaveBeenCalledWith(testCase.query);
            });
        });
    });

    describe("updateResident", () => {
        updateResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.updateResident.mockResolvedValue(testCase.expectedResult);

                const result = await controller.updateResident(testCase.id, testCase.data as any);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.updateResident).toHaveBeenCalledWith(testCase.id, testCase.data);
            });
        });
    });

    describe("deleteResident", () => {
        deleteResidentTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.deleteResident.mockResolvedValue(testCase.expectedResult);

                const result = await controller.deleteResident(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.deleteResident).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
