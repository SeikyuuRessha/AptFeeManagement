import { ExceptionCode } from "../../src/common/exception/exception-code";

// Mock Data
export const mockUsers = [
    {
        id: "1",
        email: "user1@test.com",
        password: "hashedPassword1",
        fullName: "User One",
        phoneNumber: "1234567890",
        role: "resident",
        refreshToken: "hashedRefreshToken1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        email: "admin@test.com",
        password: "hashedPassword2",
        fullName: "Admin User",
        phoneNumber: "9876543210",
        role: "admin",
        refreshToken: "hashedRefreshToken2",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
];

export const mockTokens = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
};

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: any, data: any = null) => ({ code: code.code, msg: code.msg, data });

// Test Case Types
export interface RegisterTestCase {
    name: string;
    input: any;
    expected: any;
    mockSetup: (prisma: any, jwtService: any, authService: any, input: any, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface LoginTestCase {
    name: string;
    input: any;
    expected: any;
    mockSetup: (prisma: any, jwtService: any, authService: any, input: any, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface LogoutTestCase {
    name: string;
    userId: string;
    expected: any;
    mockSetup: (prisma: any, userId: string, expected: any) => void;
    expectedResult: (expected: any) => any;
}

export interface RefreshTokenTestCase {
    name: string;
    userId: string;
    refreshToken: string;
    expected: any;
    mockSetup: (
        prisma: any,
        jwtService: any,
        authService: any,
        userId: string,
        refreshToken: string,
        expected: any
    ) => void;
    expectedResult: (expected: any) => any;
}

export interface ErrorTestCase {
    name: string;
    operation: string;
    input?: any;
    userId?: string;
    refreshToken?: string;
    mockSetup: (prisma: any, jwtService?: any, authService?: any) => void;
    expectedError: any;
}

// Test Cases Configuration
export const authTestCases = {
    register: [
        {
            name: "should register a new user successfully",
            input: {
                email: "newuser@test.com",
                password: "password123",
                fullName: "New User",
                phoneNumber: "1111111111",
                role: "resident",
            },
            expected: mockTokens,
            mockSetup: (
                prisma: any,
                jwtService: any,
                authService: any,
                input: any,
                expected: any
            ) => {
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(null);
                (prisma.resident.create as jest.Mock).mockResolvedValue({
                    id: "new-id",
                    ...input,
                    password: "hashedPassword",
                });
                jest.spyOn(authService, "hashData").mockResolvedValue("hashedPassword");
                jest.spyOn(authService, "getTokens").mockResolvedValue(expected);
                jest.spyOn(authService, "updateRefreshToken").mockResolvedValue(undefined);
            },
            expectedResult: (expected: any) => success(expected),
        },
        {
            name: "should register admin user successfully",
            input: {
                email: "admin@test.com",
                password: "adminpass123",
                fullName: "Admin User",
                phoneNumber: "2222222222",
                role: "admin",
            },
            expected: mockTokens,
            mockSetup: (
                prisma: any,
                jwtService: any,
                authService: any,
                input: any,
                expected: any
            ) => {
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(null);
                (prisma.resident.create as jest.Mock).mockResolvedValue({
                    id: "admin-id",
                    ...input,
                    password: "hashedPassword",
                });
                jest.spyOn(authService, "hashData").mockResolvedValue("hashedPassword");
                jest.spyOn(authService, "getTokens").mockResolvedValue(expected);
                jest.spyOn(authService, "updateRefreshToken").mockResolvedValue(undefined);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW REGISTER TEST CASES HERE
    ] as RegisterTestCase[],

    login: [
        {
            name: "should login with valid credentials",
            input: {
                email: "user1@test.com",
                password: "password123",
            },
            expected: mockTokens,
            mockSetup: (
                prisma: any,
                jwtService: any,
                authService: any,
                input: any,
                expected: any
            ) => {
                const { verify } = require("argon2");
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(mockUsers[0]);
                (verify as jest.Mock).mockResolvedValue(true);
                jest.spyOn(authService, "getTokens").mockResolvedValue(expected);
                jest.spyOn(authService, "updateRefreshToken").mockResolvedValue(undefined);
            },
            expectedResult: (expected: any) => success(expected),
        },
        {
            name: "should login admin user successfully",
            input: {
                email: "admin@test.com",
                password: "adminpass123",
            },
            expected: mockTokens,
            mockSetup: (
                prisma: any,
                jwtService: any,
                authService: any,
                input: any,
                expected: any
            ) => {
                const { verify } = require("argon2");
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(mockUsers[1]);
                (verify as jest.Mock).mockResolvedValue(true);
                jest.spyOn(authService, "getTokens").mockResolvedValue(expected);
                jest.spyOn(authService, "updateRefreshToken").mockResolvedValue(undefined);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW LOGIN TEST CASES HERE
    ] as LoginTestCase[],

    logout: [
        {
            name: "should logout user successfully",
            userId: "1",
            expected: { id: "1", refreshToken: null },
            mockSetup: (prisma: any, userId: string, expected: any) => {
                (prisma.resident.update as jest.Mock).mockResolvedValue(expected);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW LOGOUT TEST CASES HERE
    ] as LogoutTestCase[],

    refreshToken: [
        {
            name: "should refresh tokens successfully",
            userId: "1",
            refreshToken: "valid-refresh-token",
            expected: mockTokens,
            mockSetup: (
                prisma: any,
                jwtService: any,
                authService: any,
                userId: string,
                refreshToken: string,
                expected: any
            ) => {
                const { verify } = require("argon2");
                // Make sure the user has a refresh token
                const userWithRefreshToken = {
                    ...mockUsers[0],
                    refreshToken: "hashed-refresh-token",
                };
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(userWithRefreshToken);
                (verify as jest.Mock).mockResolvedValue(true);
                jest.spyOn(authService, "getTokens").mockResolvedValue(expected);
                jest.spyOn(authService, "updateRefreshToken").mockResolvedValue(undefined);
            },
            expectedResult: (expected: any) => success(expected),
        },
        // ADD NEW REFRESH TOKEN TEST CASES HERE
    ] as RefreshTokenTestCase[],

    errors: [
        {
            name: "should throw USER_ALREADY_EXISTS when registering existing user",
            operation: "register",
            input: {
                email: "user1@test.com",
                password: "password123",
                fullName: "Existing User",
                phoneNumber: "1111111111",
                role: "resident",
            },
            mockSetup: (prisma: any) => {
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(mockUsers[0]);
            },
            expectedError: ExceptionCode.USER_ALREADY_EXISTS,
        },
        {
            name: "should throw USER_NOT_FOUND when logging in with non-existent email",
            operation: "login",
            input: {
                email: "nonexistent@test.com",
                password: "password123",
            },
            mockSetup: (prisma: any) => {
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(null);
            },
            expectedError: ExceptionCode.USER_NOT_FOUND,
        },
        {
            name: "should throw INVALID_PASSWORD when logging in with wrong password",
            operation: "login",
            input: {
                email: "user1@test.com",
                password: "wrongpassword",
            },
            mockSetup: (prisma: any) => {
                const { verify } = require("argon2");
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(mockUsers[0]);
                (verify as jest.Mock).mockResolvedValue(false);
            },
            expectedError: ExceptionCode.INVALID_PASSWORD,
        },
        {
            name: "should throw ACCESS_DENIED when refreshing with invalid token",
            operation: "refreshTokens",
            userId: "1",
            refreshToken: "invalid-token",
            mockSetup: (prisma: any) => {
                const { verify } = require("argon2");
                // User exists with a refresh token, but token verification fails
                const userWithRefreshToken = {
                    ...mockUsers[0],
                    refreshToken: "hashed-refresh-token",
                };
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue(userWithRefreshToken);
                (verify as jest.Mock).mockResolvedValue(false);
            },
            expectedError: ExceptionCode.ACCESS_DENIED,
        },
        {
            name: "should throw ACCESS_DENIED when user has no refresh token",
            operation: "refreshTokens",
            userId: "1",
            refreshToken: "some-token",
            mockSetup: (prisma: any) => {
                (prisma.resident.findUnique as jest.Mock).mockResolvedValue({
                    ...mockUsers[0],
                    refreshToken: null,
                });
            },
            expectedError: ExceptionCode.ACCESS_DENIED,
        },
        // ADD NEW ERROR TEST CASES HERE
    ] as ErrorTestCase[],
};
