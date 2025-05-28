import { Test, TestingModule } from "@nestjs/testing";
import { BuildingsService } from "../../src/buildings/buildings.service";
import { PrismaService } from "../../src/prisma/prisma.service";

const mockBuildings = [
    { id: "1", name: "A", address: "123 St", apartmentCount: 10 },
    { id: "2", name: "B", address: "456 Ave", apartmentCount: 5 },
];

const success = (data: any) => ({ code: 1, msg: "Success", data });

const updateCases = [
    {
        id: "1",
        input: { name: "Updated", address: "123 St", apartmentCount: 10 },
        result: { id: "1", name: "Updated", address: "123 St", apartmentCount: 10 },
    },
    {
        id: "2",
        input: { name: "New Name", address: "New Addr", apartmentCount: 8 },
        result: { id: "2", name: "New Name", address: "New Addr", apartmentCount: 8 },
    },
];

describe("BuildingsService", () => {
    let service: BuildingsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BuildingsService, PrismaService],
        }).compile();

        service = module.get<BuildingsService>(BuildingsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe("getBuildings", () => {
        it("should return all buildings", async () => {
            prisma.building.findMany = jest.fn().mockResolvedValue(mockBuildings);
            const result = await service.getBuildings();
            expect(result).toEqual(success(mockBuildings));
        });
    });

    describe("getBuilding", () => {
        it("should return a building by ID", async () => {
            const building = mockBuildings[0];
            prisma.building.findUnique = jest.fn().mockResolvedValue(building);
            const result = await service.getBuilding("1");
            expect(result).toEqual(success(building));
        });
    });

    describe("createBuilding", () => {
        it("should create a building", async () => {
            const input = { name: "New", address: "Street", apartmentCount: 1 };
            const created = { id: "3", ...input };
            prisma.building.create = jest.fn().mockResolvedValue(created);
            const result = await service.createBuilding(input);
            expect(result).toEqual(success(created));
        });
    });

    describe("updateBuilding", () => {
        it.each(updateCases)("should update building %#", async ({ id, input, result }) => {
            prisma.building.update = jest.fn().mockResolvedValue(result);
            const res = await service.updateBuilding(id, input);
            expect(res).toEqual(success(result));
        });
    });

    describe("deleteBuilding", () => {
        it("should delete a building", async () => {
            const deleted = mockBuildings[0];
            prisma.building.delete = jest.fn().mockResolvedValue(deleted);
            const result = await service.deleteBuilding("1");
            expect(result).toEqual(success(deleted));
        });
    });
});
