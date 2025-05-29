// Test cases for Notifications module
import { ExceptionCode } from "../../src/common/exception/exception-code";

export interface NotificationTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult: {
        code: number;
        msg: string;
        data?: any;
    };
}

export interface CreateNotificationTestCase extends NotificationTestCase {
    data: {
        message: string;
    };
}

export interface GetNotificationTestCase extends NotificationTestCase {
    id: string;
}

// Mock data
export const mockNotifications = [
    {
        id: "notification-1",
        message: "System maintenance scheduled for tonight",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
    },
    {
        id: "notification-2",
        message: "Monthly payment reminder",
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2023-02-01"),
    },
];

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Test cases for getNotifications
export const getNotificationsTestCases: NotificationTestCase[] = [
    {
        description: "should return all notifications successfully",
        expectedResult: success(mockNotifications),
    },
    {
        description: "should return empty array when no notifications exist",
        expectedResult: success([]),
    },
];

// Test cases for getNotification
export const getNotificationTestCases: GetNotificationTestCase[] = [
    {
        description: "should return notification successfully when notification exists",
        id: "notification-1",
        expectedResult: success(mockNotifications[0]),
    },
    {
        description: "should return error when notification does not exist",
        id: "non-existent-id",
        expectedResult: error(
            ExceptionCode.NOTIFICATION_NOT_FOUND.code,
            ExceptionCode.NOTIFICATION_NOT_FOUND.msg,
            { id: "non-existent-id" }
        ),
    },
];

// Test cases for createNotification
export const createNotificationTestCases: CreateNotificationTestCase[] = [
    {
        description: "should create notification successfully with valid data",
        data: {
            message: "New system update available",
        },
        expectedResult: success({
            id: "new-notification-id",
            message: "New system update available",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
    },
    {
        description: "should create notification with long message",
        data: {
            message:
                "This is a very long notification message that contains important information about the system updates and maintenance activities",
        },
        expectedResult: success({
            id: "new-notification-id",
            message:
                "This is a very long notification message that contains important information about the system updates and maintenance activities",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
    },
];
