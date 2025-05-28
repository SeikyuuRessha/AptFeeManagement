import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsController } from "../../src/buildings/buildings.controller";
import { BuildingsService } from "../../src/buildings/buildings.service";

const success = (data: any) => ({ code: 1, msg: "Success", data });

const cases = {
    create: [
        {
            input: { name: "Test 1", address: "Addr 1", apartmentCount: 5 },
            result: { id: "1", name: "Test 1", address: "Addr 1", apartmentCount: 5 },
        },
        {
            input: { name: "Test 2", address: "Addr 2", apartmentCount: 10 },
            result: { id: "2", name: "Test 2", address: "Addr 2", apartmentCount: 10 },
        },
    ],
    update: [
        {
            id: "1",
            input: { name: "Updated 1", address: "Updated Addr 1", apartmentCount: 6 },
            result: { id: "1", name: "Updated 1", address: "Updated Addr 1", apartmentCount: 6 },
        },
        {
            id: "2",
            input: { name: "Updated 2", address: "Updated Addr 2", apartmentCount: 9 },
            result: { id: "2", name: "Updated 2", address: "Updated Addr 2", apartmentCount: 9 },
        },
    ],
};

describe("BuildingsController", () => {
    let controller: BuildingsController;

    const mockService = {
        createBuilding: jest.fn(),
        getBuildings: jest.fn().mockResolvedValue(success(cases.create.map((c) => c.result))),
        getBuilding: jest.fn().mockResolvedValue(success(cases.create[0].result)),
        updateBuilding: jest.fn(),
        deleteBuilding: jest.fn().mockResolvedValue(success(cases.create[0].result)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BuildingsController],
            providers: [{ provide: BuildingsService, useValue: mockService }],
        }).compile();

        controller = module.get<BuildingsController>(BuildingsController);
    });

    it.each(cases.create)("should create building %#", async ({ input, result }) => {
        mockService.createBuilding.mockResolvedValueOnce(success(result));
        const res = await controller.createBuilding(input);
        expect(res).toEqual(success(result));
    });

    it("should get all buildings", async () => {
        const res = await controller.getBuildings();
        expect(res).toEqual(success(cases.create.map((c) => c.result)));
    });

    it("should get building by id", async () => {
        const res = await controller.getBuilding("1");
        expect(res).toEqual(success(cases.create[0].result));
    });

    it.each(cases.update)("should update building %#", async ({ id, input, result }) => {
        mockService.updateBuilding.mockResolvedValueOnce(success(result));
        const res = await controller.updateBuilding(id, input);
        expect(res).toEqual(success(result));
    });

    it("should delete building", async () => {
        const res = await controller.deleteBuilding("1");
        expect(res).toEqual(success(cases.create[0].result));
    });
});
