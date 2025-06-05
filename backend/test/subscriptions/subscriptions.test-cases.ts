import { ExceptionCode } from "../../src/common/exception/exception-code";
import { AppException } from "../../src/common/exception/app-exception";

export interface SubscriptionTestCase {
    description: string;
    mockSetup?: () => void;
    expectedResult?: {
        code: number;
        msg: string;
        data?: any;
    };
    shouldThrow?: boolean;
    expectedError?: AppException;
}

export interface CreateSubscriptionTestCase extends SubscriptionTestCase {
    data: {
        frequency: string;
        nextBillingDate: Date;
        apartmentId: string;
        serviceId: string;
    };
}

export interface GetSubscriptionTestCase extends SubscriptionTestCase {
    id: string;
}

export interface UpdateSubscriptionTestCase extends SubscriptionTestCase {
    id: string;
    data: Partial<{
        frequency: string;
        nextBillingDate: Date;
        apartmentId: string;
        serviceId: string;
    }>;
}

export interface DeleteSubscriptionTestCase extends SubscriptionTestCase {
    id: string;
}

// Mock data
export const mockSubscriptions = [
    {
        id: "subscription-1",
        frequency: "monthly",
        nextBillingDate: new Date("2024-02-01"),
        apartmentId: "apartment-1",
        serviceId: "service-1",
        status: "active",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
    },
    {
        id: "subscription-2",
        frequency: "quarterly",
        nextBillingDate: new Date("2024-03-01"),
        apartmentId: "apartment-2",
        serviceId: "service-2",
        status: "active",
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2023-02-01"),
    },
];

export const mockApartment = {
    id: "apartment-1",
    number: "101",
    floor: 1,
    buildingId: "building-1",
    resident: {
        id: "resident-1",
        name: "Test Resident",
        email: "resident@test.com",
    },
};

export const mockService = {
    id: "service-1",
    name: "Internet",
    description: "High-speed internet service",
    price: 50.0,
};

// Helper functions
export const success = (data: any) => ({ code: 1, msg: "Success", data });
export const error = (code: number, msg: string, data: any = null) => ({ code, msg, data });

// Test cases for getSubscriptions
export const getSubscriptionsTestCases: SubscriptionTestCase[] = [
    {
        description: "should return all subscriptions successfully",
        expectedResult: success(mockSubscriptions),
    },
    {
        description: "should return empty array when no subscriptions exist",
        expectedResult: success([]),
    },
];

// Test cases for getSubscription
export const getSubscriptionTestCases: GetSubscriptionTestCase[] = [
    {
        description: "should return subscription successfully when subscription exists",
        id: "subscription-1",
        expectedResult: success(mockSubscriptions[0]),
    },
    {
        description: "should throw SUBSCRIPTION_NOT_FOUND when subscription does not exist",
        id: "non-existent-id",
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg),
    },
];

// Test cases for createSubscription
export const createSubscriptionTestCases: CreateSubscriptionTestCase[] = [
    {
        description: "should create subscription successfully with valid data",
        data: {
            frequency: "monthly",
            nextBillingDate: new Date("2024-02-01"),
            apartmentId: "apartment-1",
            serviceId: "service-1",
        },
        expectedResult: success({
            id: "new-subscription-id",
            frequency: "monthly",
            nextBillingDate: new Date("2024-02-01"),
            apartmentId: "apartment-1",
            serviceId: "service-1",
            status: "active",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }),
    },
    {
        description: "should throw SERVICE_NOT_FOUND when service does not exist",
        data: {
            frequency: "monthly",
            nextBillingDate: new Date("2024-02-01"),
            apartmentId: "apartment-1",
            serviceId: "non-existent-service",
        },
        expectedResult: error(ExceptionCode.SERVICE_NOT_FOUND.code, ExceptionCode.SERVICE_NOT_FOUND.msg),
    },
    {
        description: "should throw APARTMENT_NOT_FOUND when apartment does not exist",
        data: {
            frequency: "monthly",
            nextBillingDate: new Date("2024-02-01"),
            apartmentId: "non-existent-apartment",
            serviceId: "service-1",
        },
        expectedResult: error(ExceptionCode.APARTMENT_NOT_FOUND.code, ExceptionCode.APARTMENT_NOT_FOUND.msg),
    },
];

// Test cases for updateSubscription
export const updateSubscriptionTestCases: UpdateSubscriptionTestCase[] = [
    {
        description: "should update subscription successfully when subscription exists",
        id: "subscription-1",
        data: {
            frequency: "quarterly",
            nextBillingDate: new Date("2024-03-01"),
        },
        expectedResult: success({
            ...mockSubscriptions[0],
            frequency: "quarterly",
            nextBillingDate: new Date("2024-03-01"),
            updatedAt: expect.any(Date),
        }),
    },
    {
        description: "should throw SUBSCRIPTION_NOT_FOUND when subscription does not exist",
        id: "non-existent-id",
        data: {
            frequency: "quarterly",
        },
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg),
    },
];

// Test cases for deleteSubscription
export const deleteSubscriptionTestCases: DeleteSubscriptionTestCase[] = [
    {
        description: "should delete subscription successfully when subscription exists",
        id: "subscription-1",
        expectedResult: success(mockSubscriptions[0]),
    },
    {
        description: "should throw SUBSCRIPTION_NOT_FOUND when subscription does not exist",
        id: "non-existent-id",
        expectedResult: error(ExceptionCode.SUBSCRIPTION_NOT_FOUND.code, ExceptionCode.SUBSCRIPTION_NOT_FOUND.msg),
    },
];
