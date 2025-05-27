import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsService } from "../../src/buildings/buildings.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { CreateBuildingDTO } from "../../src/buildings/dtos/create-building.dto";
import { UpdateBuildingDTO } from "../../src/buildings/dtos/update-building.dto";

describe("BuildingsService", () => {
    let service: BuildingsService;
    const mockPrisma = {
        building: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BuildingsService, { provide: PrismaService, useValue: mockPrisma }],
        }).compile();

        service = module.get<BuildingsService>(BuildingsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getBuildings", () => {
        it("should return all buildings", async () => {
            const buildings = [{ id: "1", name: "A", address: "123 St", apartmentCount: 10 }];
            mockPrisma.building.findMany.mockResolvedValue(buildings);

            const result = await service.getBuildings();
            expect(result.data).toEqual(buildings);
            expect(result.code).toEqual(1);
            expect(result.msg).toEqual("Success");
        });
    });

    describe("getBuilding", () => {
        it("should return one building", async () => {
            const building = { id: "1", name: "B", address: "456 Ave", apartmentCount: 5 };
            mockPrisma.building.findUnique.mockResolvedValue(building);

            const result = await service.getBuilding("1");
            expect(result.data).toEqual(building);
        });
    });

    describe("createBuilding", () => {
        it("should create a building", async () => {
            const dto: CreateBuildingDTO = {
                name: "C",
                address: "789 Blvd",
                apartmentCount: 12,
            };
            const expected = { id: "1", ...dto };
            mockPrisma.building.create.mockResolvedValue(expected);

            const result = await service.createBuilding(dto);
            expect(result.data).toEqual(expected);
        });
    });

    describe("updateBuilding", () => {
        it("should update a building", async () => {
            const dto: UpdateBuildingDTO = {
                name: "Updated Name",
                apartmentCount: 20,
            };
            const expected = {
                id: "1",
                name: dto.name,
                address: "Old Address",
                apartmentCount: 20,
            };
            mockPrisma.building.update.mockResolvedValue(expected);

            const result = await service.updateBuilding("1", dto);
            expect(result.data).toEqual(expected);
        });
    });

    describe("deleteBuilding", () => {
        it("should delete a building", async () => {
            const deleted = { id: "1", name: "Deleted", address: "Nowhere", apartmentCount: 0 };
            mockPrisma.building.delete.mockResolvedValue(deleted);

            const result = await service.deleteBuilding("1");
            expect(result.data).toEqual(deleted);
        });
    });
});
