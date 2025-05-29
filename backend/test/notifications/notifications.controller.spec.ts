import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsController } from "../../src/notifications/notifications.controller";
import { NotificationsService } from "../../src/notifications/notifications.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    getNotificationsTestCases,
    getNotificationTestCases,
    createNotificationTestCases,
    CreateNotificationTestCase,
    GetNotificationTestCase,
    NotificationTestCase,
} from "./notifications.test-cases";

describe("NotificationsController", () => {
    let controller: NotificationsController;
    let notificationsService: any;

    beforeEach(async () => {
        const mockNotificationsService = {
            getNotifications: jest.fn(),
            getNofication: jest.fn(),
            createNofication: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<NotificationsController>(NotificationsController);
        notificationsService = module.get(NotificationsService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getNotifications", () => {
        getNotificationsTestCases.forEach((testCase: NotificationTestCase) => {
            it(testCase.description, async () => {
                notificationsService.getNotifications.mockResolvedValue(testCase.expectedResult);
                const result = await controller.getNotifications();
                expect(result).toEqual(testCase.expectedResult);
                expect(notificationsService.getNotifications).toHaveBeenCalled();
            });
        });
    });
    describe("getNofication", () => {
        getNotificationTestCases.forEach((testCase: GetNotificationTestCase) => {
            it(testCase.description, async () => {
                notificationsService.getNofication.mockResolvedValue(testCase.expectedResult);
                const result = await controller.getNofication(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(notificationsService.getNofication).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("createNotificaiton", () => {
        createNotificationTestCases.forEach((testCase: CreateNotificationTestCase) => {
            it(testCase.description, async () => {
                notificationsService.createNofication.mockResolvedValue(testCase.expectedResult);
                const result = await controller.createNotificaiton(testCase.data);
                expect(result).toEqual(testCase.expectedResult);
                expect(notificationsService.createNofication).toHaveBeenCalledWith(testCase.data);
            });
        });
    });
});
