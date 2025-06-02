import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../src/auth/auth.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { authTestCases, error } from "./auth.test-cases";

// Mock argon2
jest.mock("argon2", () => ({
    hash: jest.fn(),
    verify: jest.fn(),
}));

describe("AuthService", () => {
    let service: AuthService;
    let prisma: any;
    let jwtService: any;
    let configService: any;

    beforeEach(async () => {
        const mockPrismaService = {
            resident: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        const mockJwtService = {
            signAsync: jest.fn(),
        };

        const mockConfigService = {
            get: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);

        // Setup default config mock
        (configService.get as jest.Mock).mockImplementation((key: string) => {
            const config = {
                JWT_ACCESS_SECRET: "access-secret",
                JWT_REFRESH_SECRET: "refresh-secret",
                JWT_ACCESS_EXPIRESIN: "15m",
                JWT_REFRESH_EXPIRESIN: "7d",
            };
            return config[key];
        });

        jest.clearAllMocks();
    });

    describe("register", () => {
        authTestCases.register.forEach(({ name, input, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, jwtService, service, input, expected);
                const result = await service.register(input);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("login", () => {
        authTestCases.login.forEach(({ name, input, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, jwtService, service, input, expected);
                const result = await service.login(input);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("logout", () => {
        authTestCases.logout.forEach(({ name, userId, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, userId, expected);
                const result = await service.logout(userId);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("refreshTokens", () => {
        authTestCases.refreshToken.forEach(({ name, userId, refreshToken, expected, mockSetup, expectedResult }) => {
            it(name, async () => {
                mockSetup(prisma, jwtService, service, userId, refreshToken, expected);
                const result = await service.refreshTokens(userId, refreshToken);
                expect(result).toEqual(expectedResult(expected));
            });
        });
    });

    describe("getTokens", () => {
        it("should generate access and refresh tokens", async () => {
            const userId = "1";
            const email = "test@test.com";
            const role = "resident";

            (jwtService.signAsync as jest.Mock)
                .mockResolvedValueOnce("access-token")
                .mockResolvedValueOnce("refresh-token");

            const result = await service.getTokens(userId, email, role);

            expect(result).toEqual({
                accessToken: "access-token",
                refreshToken: "refresh-token",
            });
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
        });
    });

    describe("hashData", () => {
        it("should hash data successfully", async () => {
            const { hash } = require("argon2");
            (hash as jest.Mock).mockResolvedValue("hashedData");

            const result = await service.hashData("plainData");

            expect(result).toBe("hashedData");
            expect(hash).toHaveBeenCalledWith("plainData");
        });
    });

    describe("updateRefreshToken", () => {
        it("should update refresh token for user", async () => {
            const userId = "1";
            const refreshToken = "newRefreshToken";
            const hashedToken = "hashedRefreshToken";

            const { hash } = require("argon2");
            (hash as jest.Mock).mockResolvedValue(hashedToken);
            (prisma.resident.update as jest.Mock).mockResolvedValue({});

            await service.updateRefreshToken(userId, refreshToken);

            expect(prisma.resident.update).toHaveBeenCalledWith({
                where: { id: userId },
                data: { refreshToken: hashedToken },
            });
        });
    });
    describe("Error Handling", () => {
        authTestCases.errors.forEach(({ name, operation, input, userId, refreshToken, mockSetup, expectedError }) => {
            it(name, async () => {
                mockSetup(prisma, jwtService, service);
                let promise: Promise<any>;

                switch (operation) {
                    case "register":
                        promise = service.register(input);
                        break;
                    case "login":
                        promise = service.login(input);
                        break;
                    case "refreshTokens":
                        promise = service.refreshTokens(userId!, refreshToken!);
                        break;
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }

                await expect(promise).rejects.toThrow();
            });
        });
    });
});
