import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { AllExceptionsFilter } from "../HttpExceptionsFilter";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { Role } from "../../src/common/enums";
import { RolesGuard } from "../../src/common/guards/roles.guard";

describe("Buildings E2E", () => {
    let app: INestApplication;
    let createdId: string;

    const buildingCases = [
        {
            input: { name: "E2E Building", address: "e2e addr", apartmentCount: 3 },
            expected: { code: 1, msg: "Success" },
        },
        {
            input: { name: "", address: "", apartmentCount: -1 },
            expected: {
                code: 0,
                msg: [
                    "name should not be empty",
                    "address should not be empty",
                    "apartmentCount must be a positive number",
                ],
            },
        },
    ];
    const createdIds: string[] = [];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({
                canActivate: (context) => {
                    const request = context.switchToHttp().getRequest();
                    request.user = { id: "test-user", role: Role.ADMIN };
                    return true;
                },
            })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: (context) => {
                    const request = context.switchToHttp().getRequest();
                    request.user = { role: Role.ADMIN };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter());
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe("POST /buildings", () => {
        it.each(buildingCases)("should handle building input %#", async (testCase) => {
            const res = await request(app.getHttpServer()).post("/buildings").send(testCase.input);

            expect(res.body.code).toBe(testCase.expected.code);
            expect(res.body.msg).toEqual(testCase.expected.msg);

            if (res.body.code === 1) {
                expect(res.body.data).toMatchObject(testCase.input);
                createdIds.push(res.body.data.id);
            }
        });
    });

    describe("GET /buildings/:id", () => {
        it("should get all created buildings", async () => {
            for (const id of createdIds) {
                const res = await request(app.getHttpServer()).get(`/buildings/${id}`);

                expect(res.body.code).toBe(1);
                expect(res.body.data.id).toBe(id);
            }
        });
    });

    describe("PUT /buildings/:id", () => {
        it("should update all created buildings", async () => {
            for (const id of createdIds) {
                const updated = { name: "Updated " + id, address: "New addr", apartmentCount: 7 };
                const res = await request(app.getHttpServer())
                    .put(`/buildings/${id}`)
                    .send(updated);

                expect(res.body.code).toBe(1);
                expect(res.body.data.name).toBe("Updated " + id);
            }
        });
    });

    describe("DELETE /buildings/:id", () => {
        it("should delete all created buildings", async () => {
            for (const id of createdIds) {
                const res = await request(app.getHttpServer()).delete(`/buildings/${id}`);

                expect(res.body.code).toBe(1);
                expect(res.body.data.id).toBe(id);
            }
        });
    });
});
