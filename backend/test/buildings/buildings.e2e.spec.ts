import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";

describe("Buildings E2E", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({
                canActivate: () => true,
            })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: () => true,
            })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        prisma = moduleRef.get(PrismaService);
        await prisma.building.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });

    const buildingDto = {
        name: "Test Building",
        address: "123 E2E St",
        apartmentCount: 5,
    };

    let createdId: string;

    it("POST /buildings - create building", async () => {
        const response = await request(app.getHttpServer())
            .post("/buildings")
            .set("Authorization", "Bearer ADMIN_TOKEN") // nếu có Auth, mock hoặc disable guard
            .send(buildingDto)
            .expect(201);

        expect(response.body.data).toMatchObject(buildingDto);
        createdId = response.body.data.id;
    });

    it("GET /buildings - get all buildings", async () => {
        const response = await request(app.getHttpServer()).get("/buildings").expect(200);

        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("GET /buildings/:id - get one building", async () => {
        const response = await request(app.getHttpServer())
            .get(`/buildings/${createdId}`)
            .expect(200);

        expect(response.body.data.id).toBe(createdId);
        expect(response.body.data.name).toBe(buildingDto.name);
    });

    it("PUT /buildings/:id - update building", async () => {
        const updated = { ...buildingDto, name: "Updated E2E" };
        const response = await request(app.getHttpServer())
            .put(`/buildings/${createdId}`)
            .set("Authorization", "Bearer ADMIN_TOKEN")
            .send(updated)
            .expect(200);

        expect(response.body.data.name).toBe("Updated E2E");
    });

    it("DELETE /buildings/:id - delete building", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/buildings/${createdId}`)
            .set("Authorization", "Bearer ADMIN_TOKEN")
            .expect(200);

        expect(response.body.data.id).toBe(createdId);
    });
});
