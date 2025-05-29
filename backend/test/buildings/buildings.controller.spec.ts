import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsController } from "../../src/buildings/buildings.controller";
import { BuildingsService } from "../../src/buildings/buildings.service";
import { ExceptionCode } from "../../src/common/exception/exception-code";

const success = (data: any) => ({ code: 1, msg: "Success", data });
const error = (code: any, data: any = null) => ({ code: code.code, msg: code.msg, data });

// Test Cases Configuration
const controllerTestCases = {
    create: [
        {
            name: "should create building with valid data",
            input: { name: "Test 1", address: "Addr 1", apartmentCount: 5 },
            result: { id: "1", name: "Test 1", address: "Addr 1", apartmentCount: 5 },
            expected: (result: any) => success(result),
        },
        {
            name: "should create building with large apartment count",
            input: { name: "Test 2", address: "Addr 2", apartmentCount: 100 },
            result: { id: "2", name: "Test 2", address: "Addr 2", apartmentCount: 100 },
            expected: (result: any) => success(result),
        },
        {
            name: "should create building with minimum apartment count",
            input: { name: "Small Building", address: "Small Addr", apartmentCount: 1 },
            result: { id: "3", name: "Small Building", address: "Small Addr", apartmentCount: 1 },
            expected: (result: any) => success(result),
        },
    ],
    update: [
        {
            name: "should update building with valid data",
            id: "1",
            input: { name: "Updated 1", address: "Updated Addr 1", apartmentCount: 6 },
            result: { id: "1", name: "Updated 1", address: "Updated Addr 1", apartmentCount: 6 },
            expected: (result: any) => success(result),
        },
        {
            name: "should update only name field",
            id: "2",
            input: { name: "Only Name Updated" },
            result: {
                id: "2",
                name: "Only Name Updated",
                address: "Original Addr",
                apartmentCount: 10,
            },
            expected: (result: any) => success(result),
        },
    ],
    errors: [
        {
            name: "should handle building not found error in getBuilding",
            operation: "getBuilding",
            id: "non-existent",
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
        },
        {
            name: "should handle building not found error in updateBuilding",
            operation: "updateBuilding",
            id: "non-existent",
            input: { name: "Updated" },
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
        },
        {
            name: "should handle building not found error in deleteBuilding",
            operation: "deleteBuilding",
            id: "non-existent",
            expectedError: ExceptionCode.BUILDING_NOT_FOUND,
        },
    ],
};

describe("BuildingsController", () => {
    let controller: BuildingsController;

    const mockService = {
        createBuilding: jest.fn(),
        getBuildings: jest
            .fn()
            .mockResolvedValue(success(controllerTestCases.create.map((c) => c.result))),
        getBuilding: jest.fn(),
        updateBuilding: jest.fn(),
        deleteBuilding: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BuildingsController],
            providers: [{ provide: BuildingsService, useValue: mockService }],
        }).compile();

        controller = module.get<BuildingsController>(BuildingsController);
        jest.clearAllMocks();
    });

    describe("createBuilding", () => {
        controllerTestCases.create.forEach(({ name, input, result, expected }) => {
            it(name, async () => {
                mockService.createBuilding.mockResolvedValueOnce(expected(result));
                const res = await controller.createBuilding(input);
                expect(res).toEqual(expected(result));
                expect(mockService.createBuilding).toHaveBeenCalledWith(input);
            });
        });
    });

    describe("getBuildings", () => {
        it("should get all buildings", async () => {
            const expectedData = controllerTestCases.create.map((c) => c.result);
            const res = await controller.getBuildings();
            expect(res).toEqual(success(expectedData));
            expect(mockService.getBuildings).toHaveBeenCalled();
        });
    });

    describe("getBuilding", () => {
        it("should get building by id", async () => {
            const testResult = controllerTestCases.create[0].result;
            mockService.getBuilding.mockResolvedValue(success(testResult));
            const res = await controller.getBuilding("1");
            expect(res).toEqual(success(testResult));
            expect(mockService.getBuilding).toHaveBeenCalledWith("1");
        });
    });

    describe("updateBuilding", () => {
        controllerTestCases.update.forEach(({ name, id, input, result, expected }) => {
            it(name, async () => {
                mockService.updateBuilding.mockResolvedValueOnce(expected(result));
                const res = await controller.updateBuilding(id, input);
                expect(res).toEqual(expected(result));
                expect(mockService.updateBuilding).toHaveBeenCalledWith(id, input);
            });
        });
    });

    describe("deleteBuilding", () => {
        it("should delete building", async () => {
            const testResult = controllerTestCases.create[0].result;
            mockService.deleteBuilding.mockResolvedValue(success(testResult));
            const res = await controller.deleteBuilding("1");
            expect(res).toEqual(success(testResult));
            expect(mockService.deleteBuilding).toHaveBeenCalledWith("1");
        });
    });
    describe("Error Handling", () => {
        controllerTestCases.errors.forEach(({ name, operation, id, input, expectedError }) => {
            it(name, async () => {
                const errorResponse = error(expectedError, { id });

                switch (operation) {
                    case "getBuilding":
                        mockService.getBuilding.mockResolvedValue(errorResponse);
                        const getResult = await controller.getBuilding(id);
                        expect(getResult).toEqual(errorResponse);
                        break;
                    case "updateBuilding":
                        mockService.updateBuilding.mockResolvedValue(errorResponse);
                        const updateResult = await controller.updateBuilding(id, input || {});
                        expect(updateResult).toEqual(errorResponse);
                        break;
                    case "deleteBuilding":
                        mockService.deleteBuilding.mockResolvedValue(errorResponse);
                        const deleteResult = await controller.deleteBuilding(id);
                        expect(deleteResult).toEqual(errorResponse);
                        break;
                }
            });
        });
    });
});
