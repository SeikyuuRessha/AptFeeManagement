import { hash, verify } from "argon2";
import { PrismaService } from "../prisma/prisma.service";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { LoginDTO } from "./dtos/login.dto";
import { RegisterDTO } from "./dtos/register.dto";
import { handleService } from "../common/utils/handleService";

import { AppException } from "../common/exception/app-exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    register(data: RegisterDTO) {
        return handleService(async () => {
            const userExists = await this.prisma.resident.findUnique({
                where: { email: data.email },
            });

            if (userExists) {
                throw new AppException(ExceptionCode.USER_ALREADY_EXISTS);
            }

            // Hash password
            const hashedPassword = await this.hashData(data.password);
            const newUser = await this.prisma.resident.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });

            const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);

            await this.updateRefreshToken(newUser.id, tokens.refreshToken);

            return tokens;
        });
    }

    login(data: LoginDTO) {
        return handleService(async () => {
            const user = await this.prisma.resident.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                throw new AppException(ExceptionCode.USER_NOT_FOUND);
            }

            const passwordMatches = await verify(user.password, data.password);
            if (!passwordMatches) {
                throw new AppException(ExceptionCode.INVALID_PASSWORD);
            }

            const tokens = await this.getTokens(user.id, user.email, user.role);

            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        });
    }

    async logout(userId: string) {
        return handleService(() =>
            this.prisma.resident.update({
                where: { id: userId },
                data: { refreshToken: null },
            })
        );
    }

    async refreshTokens(userId: string, refreshToken: string) {
        return handleService(async () => {
            const user = await this.prisma.resident.findUnique({
                where: { id: userId },
            });
            if (!user || !user.refreshToken) {
                throw new AppException(ExceptionCode.ACCESS_DENIED);
            }
            const refreshTokenMatches = await verify(user.refreshToken, refreshToken);
            if (!refreshTokenMatches) {
                throw new AppException(ExceptionCode.ACCESS_DENIED);
            }

            const tokens = await this.getTokens(user.id, user.email, user.role);
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        });
    }

    async hashData(data: string): Promise<string> {
        try {
            return await hash(data);
        } catch (error) {
            throw new AppException(ExceptionCode.HASHING_FAILED, { error: JSON.stringify(error) });
        }
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.prisma.resident.update({
            where: { id: userId },
            data: {
                refreshToken: hashedRefreshToken,
            },
        });
    }

    async getTokens(userId: string, email: string, role: string) {
        try {
            const payload = {
                sub: userId,
                email,
                role,
            };

            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload, {
                    secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
                    expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRESIN"),
                }),
                this.jwtService.signAsync(payload, {
                    secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
                    expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRESIN"),
                }),
            ]);

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw new AppException(ExceptionCode.INTERNAL_SERVER_ERROR, {
                error: JSON.stringify(error),
            });
        }
    }
}
