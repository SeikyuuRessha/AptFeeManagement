import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { ExceptionCode } from "../../src/common/exception/exception-code";

const success = (data: any) => ({ code: 1, msg: "Success", data });
const error = (code: any, data: any = null) => ({ code: code.code, msg: code.msg, data });

const mockTokens = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
};

const controllerTestCases = {
    register: [
        {
            name: "should register user with valid data",
            input: {
                email: "test@test.com",
                password: "password123",
                fullName: "Test User",
                phone: "1234567890",
            },
            result: mockTokens,
            expected: (result: any) => success(result),
        },
        {
            name: "should register admin user",
            input: {
                email: "admin@test.com",
                password: "adminpass123",
                fullName: "Admin User",
                phone: "9876543210",
            },
            result: mockTokens,
            expected: (result: any) => success(result),
        },
    ],
    login: [
        {
            name: "should login with valid credentials",
            input: {
                email: "test@test.com",
                password: "password123",
            },
            result: mockTokens,
            expected: (result: any) => success(result),
        },
    ],
    logout: [
        {
            name: "should logout user successfully",
            userId: "1",
            result: { success: true },
            expected: (result: any) => success(result),
        },
    ],
    refresh: [
        {
            name: "should refresh tokens successfully",
            userId: "1",
            refreshToken: "valid-refresh-token",
            result: mockTokens,
            expected: (result: any) => success(result),
        },
    ],
    errors: [
        {
            name: "should handle user already exists error in register",
            operation: "register",
            input: {
                email: "existing@test.com",
                password: "password123",
                fullName: "Existing User",
                phone: "1234567890",
            },
            expectedError: ExceptionCode.USER_ALREADY_EXISTS,
        },
        {
            name: "should handle user not found error in login",
            operation: "login",
            input: {
                email: "nonexistent@test.com",
                password: "password123",
            },
            expectedError: ExceptionCode.USER_NOT_FOUND,
        },
        {
            name: "should handle invalid password error in login",
            operation: "login",
            input: {
                email: "test@test.com",
                password: "wrongpassword",
            },
            expectedError: ExceptionCode.INVALID_PASSWORD,
        },
        {
            name: "should handle access denied error in refresh",
            operation: "refresh",
            userId: "1",
            refreshToken: "invalid-token",
            expectedError: ExceptionCode.ACCESS_DENIED,
        },
    ],
};

describe("AuthController", () => {
    let controller: AuthController;

    const mockService = {
        register: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
        refreshTokens: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockService }],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        jest.clearAllMocks();
    });

    describe("register", () => {
        controllerTestCases.register.forEach(({ name, input, result, expected }) => {
            it(name, async () => {
                mockService.register.mockResolvedValueOnce(expected(result));
                const res = await controller.register(input);
                expect(res).toEqual(expected(result));
                expect(mockService.register).toHaveBeenCalledWith(input);
            });
        });
    });

    describe("login", () => {
        controllerTestCases.login.forEach(({ name, input, result, expected }) => {
            it(name, async () => {
                mockService.login.mockResolvedValueOnce(expected(result));
                const res = await controller.login(input);
                expect(res).toEqual(expected(result));
                expect(mockService.login).toHaveBeenCalledWith(input);
            });
        });
    });

    describe("logout", () => {
        controllerTestCases.logout.forEach(({ name, userId, result, expected }) => {
            it(name, async () => {
                const mockReq = { user: { sub: userId } } as any;
                mockService.logout.mockResolvedValueOnce(expected(result));
                const res = await controller.logout(mockReq);
                expect(res).toEqual(expected(result));
                expect(mockService.logout).toHaveBeenCalledWith(userId);
            });
        });
    });

    describe("refresh", () => {
        controllerTestCases.refresh.forEach(({ name, userId, refreshToken, result, expected }) => {
            it(name, async () => {
                const mockReq = { user: { sub: userId, refreshToken } } as any;
                mockService.refreshTokens.mockResolvedValueOnce(expected(result));
                const res = await controller.refreshTokens(mockReq);
                expect(res).toEqual(expected(result));
                expect(mockService.refreshTokens).toHaveBeenCalledWith(userId, refreshToken);
            });
        });
    });
    describe("Error Handling", () => {
        controllerTestCases.errors.forEach(({ name, operation, input, userId, refreshToken, expectedError }) => {
            it(name, async () => {
                const errorResponse = error(expectedError, expect.any(Object));

                switch (operation) {
                    case "register":
                        if (input) {
                            mockService.register.mockResolvedValue(errorResponse);
                            const registerResult = await controller.register(input as any);
                            expect(registerResult).toEqual(errorResponse);
                        }
                        break;
                    case "login":
                        if (input) {
                            mockService.login.mockResolvedValue(errorResponse);
                            const loginResult = await controller.login(input as any);
                            expect(loginResult).toEqual(errorResponse);
                        }
                        break;
                    case "logout":
                        if (userId) {
                            const mockReq = { user: { sub: userId } } as any;
                            mockService.logout.mockResolvedValue(errorResponse);
                            const logoutResult = await controller.logout(mockReq);
                            expect(logoutResult).toEqual(errorResponse);
                        }
                        break;
                    case "refresh":
                        if (userId && refreshToken) {
                            const refreshReq = { user: { sub: userId, refreshToken } } as any;
                            mockService.refreshTokens.mockResolvedValue(errorResponse);
                            const refreshResult = await controller.refreshTokens(refreshReq);
                            expect(refreshResult).toEqual(errorResponse);
                        }
                        break;
                }
            });
        });
    });
});
