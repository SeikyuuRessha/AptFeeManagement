import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsService } from "../../src/notifications/notifications.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AppException } from "../../src/common/exception/app-exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import {
    mockNotifications,
    getNotificationsTestCases,
    getNotificationTestCases,
    createNotificationTestCases,
    CreateNotificationTestCase,
    GetNotificationTestCase,
    NotificationTestCase,
} from "./notifications.test-cases";

describe("NotificationsService", () => {
    let service: NotificationsService;
    let prismaService: any;

    beforeEach(async () => {
        const mockPrismaService = {
            notification: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("getNotifications", () => {
        getNotificationsTestCases.forEach((testCase: NotificationTestCase) => {
            it(testCase.description, async () => {
                prismaService.notification.findMany.mockResolvedValue(testCase.expectedResult.data);
                const result = await service.getNotifications();
                expect(result).toEqual(testCase.expectedResult);
            });
        });
    });
    describe("getNofication", () => {
        getNotificationTestCases.forEach((testCase: GetNotificationTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult.code === 1) {
                    // Success case
                    prismaService.notification.findUnique.mockResolvedValue(
                        testCase.expectedResult.data
                    );
                    const result = await service.getNofication(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else {
                    // Error case
                    prismaService.notification.findUnique.mockResolvedValue(null);
                    const result = await service.getNofication(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                }
            });
        });
    });
    describe("createNofication", () => {
        createNotificationTestCases.forEach((testCase: CreateNotificationTestCase) => {
            it(testCase.description, async () => {
                prismaService.notification.create.mockResolvedValue(testCase.expectedResult.data);
                const result = await service.createNofication(testCase.data);
                expect(result).toEqual(testCase.expectedResult);
                expect(prismaService.notification.create).toHaveBeenCalledWith({
                    data: testCase.data,
                });
            });
        });
    });
});
