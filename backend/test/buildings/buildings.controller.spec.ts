import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsController } from "../../src/buildings/buildings.controller";
import { BuildingsService } from "../../src/buildings/buildings.service";
import { CreateBuildingDTO } from "../../src/buildings/dtos/create-building.dto";
import { UpdateBuildingDTO } from "../../src/buildings/dtos/update-building.dto";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";

describe("BuildingsController", () => {
    let controller: BuildingsController;

    const mockBuildingsService = {
        getBuildings: jest.fn(),
        getBuilding: jest.fn(),
        createBuilding: jest.fn(),
        updateBuilding: jest.fn(),
        deleteBuilding: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BuildingsController],
            providers: [
                {
                    provide: BuildingsService,
                    useValue: mockBuildingsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: () => true }) // Bypass auth
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true }) // Bypass roles
            .compile();

        controller = module.get<BuildingsController>(BuildingsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getBuildings", () => {
        it("should return all buildings", async () => {
            const buildings = [{ id: "1", name: "A", address: "123 St", apartmentCount: 10 }];
            mockBuildingsService.getBuildings.mockResolvedValue(buildings);

            const result = await controller.getBuildings();
            expect(result).toEqual(buildings);
        });
    });

    describe("getBuilding", () => {
        it("should return a building by id", async () => {
            const building = { id: "1", name: "B", address: "456 Ave", apartmentCount: 5 };
            mockBuildingsService.getBuilding.mockResolvedValue(building);

            const result = await controller.getBuilding("1");
            expect(result).toEqual(building);
        });
    });

    describe("createBuilding", () => {
        it("should create a building", async () => {
            const dto: CreateBuildingDTO = {
                name: "C",
                address: "789 Blvd",
                apartmentCount: 12,
            };
            const created = { id: "1", ...dto };
            mockBuildingsService.createBuilding.mockResolvedValue(created);

            const result = await controller.createBuilding(dto);
            expect(result).toEqual(created);
        });
    });

    describe("updateBuilding", () => {
        it("should update a building", async () => {
            const dto: UpdateBuildingDTO = {
                name: "Updated",
                apartmentCount: 20,
            };
            const updated = {
                id: "1",
                name: "Updated",
                address: "Old Address",
                apartmentCount: 20,
            };
            mockBuildingsService.updateBuilding.mockResolvedValue(updated);

            const result = await controller.updateBuilding("1", dto);
            expect(result).toEqual(updated);
        });
    });

    describe("deleteBuilding", () => {
        it("should delete a building", async () => {
            const deleted = {
                id: "1",
                name: "Deleted",
                address: "Nowhere",
                apartmentCount: 0,
            };
            mockBuildingsService.deleteBuilding.mockResolvedValue(deleted);

            const result = await controller.deleteBuilding("1");
            expect(result).toEqual(deleted);
        });
    });
});
