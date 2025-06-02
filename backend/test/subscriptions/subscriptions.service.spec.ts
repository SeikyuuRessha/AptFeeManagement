import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsService } from "../../src/subscriptions/subscriptions.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import {
    mockSubscriptions,
    mockApartment,
    mockService,
    getSubscriptionsTestCases,
    getSubscriptionTestCases,
    createSubscriptionTestCases,
    updateSubscriptionTestCases,
    deleteSubscriptionTestCases,
    CreateSubscriptionTestCase,
    GetSubscriptionTestCase,
    UpdateSubscriptionTestCase,
    DeleteSubscriptionTestCase,
    SubscriptionTestCase,
} from "./subscriptions.test-cases";

describe("SubscriptionsService", () => {
    let service: SubscriptionsService;
    let prismaService: any;

    beforeEach(async () => {
        const mockPrismaService = {
            subscription: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            service: {
                findUnique: jest.fn(),
            },
            apartment: {
                findUnique: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<SubscriptionsService>(SubscriptionsService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("getSubscriptions", () => {
        getSubscriptionsTestCases.forEach((testCase: SubscriptionTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult && testCase.expectedResult.code === 1) {
                    prismaService.subscription.findMany.mockResolvedValue(testCase.expectedResult.data);
                    const result = await service.getSubscriptions();
                    expect(result).toEqual(testCase.expectedResult);
                }
            });
        });
    });
    describe("getSubscription", () => {
        getSubscriptionTestCases.forEach((testCase: GetSubscriptionTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult && testCase.expectedResult.code === 1) {
                    prismaService.subscription.findUnique.mockResolvedValue(testCase.expectedResult.data);
                    const result = await service.getSubscription(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                } else if (testCase.expectedResult) {
                    prismaService.subscription.findUnique.mockResolvedValue(null);
                    await expect(service.getSubscription(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
    describe("createSubscription", () => {
        createSubscriptionTestCases.forEach((testCase: CreateSubscriptionTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult && testCase.expectedResult.code === 1) {
                    // Mock valid service and apartment
                    prismaService.service.findUnique.mockResolvedValue(mockService);
                    prismaService.apartment.findUnique.mockResolvedValue(mockApartment);
                    prismaService.subscription.create.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.createSubscription(testCase.data);
                    expect(result).toEqual(testCase.expectedResult);
                    expect(prismaService.subscription.create).toHaveBeenCalledWith({
                        data: {
                            ...testCase.data,
                            status: "active",
                        },
                    });
                } else if (testCase.expectedResult && testCase.expectedResult.code === 2005) {
                    // SERVICE_NOT_FOUND
                    prismaService.service.findUnique.mockResolvedValue(null);
                    await expect(service.createSubscription(testCase.data)).rejects.toThrow();
                } else if (testCase.expectedResult && testCase.expectedResult.code === 2003) {
                    // APARTMENT_NOT_FOUND
                    prismaService.service.findUnique.mockResolvedValue(mockService);
                    prismaService.apartment.findUnique.mockResolvedValue(null);
                    await expect(service.createSubscription(testCase.data)).rejects.toThrow();
                }
            });
        });
    });
    describe("updateSubscription", () => {
        updateSubscriptionTestCases.forEach((testCase: UpdateSubscriptionTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult && testCase.expectedResult.code === 1) {
                    prismaService.subscription.findUnique.mockResolvedValue(mockSubscriptions[0]);
                    prismaService.subscription.update.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.updateSubscription(testCase.id, testCase.data);
                    expect(result).toEqual(testCase.expectedResult);
                    expect(prismaService.subscription.update).toHaveBeenCalledWith({
                        where: { id: testCase.id },
                        data: testCase.data,
                    });
                } else if (testCase.expectedResult) {
                    prismaService.subscription.findUnique.mockResolvedValue(null);
                    await expect(service.updateSubscription(testCase.id, testCase.data)).rejects.toThrow();
                }
            });
        });
    });
    describe("deleteSubscription", () => {
        deleteSubscriptionTestCases.forEach((testCase: DeleteSubscriptionTestCase) => {
            it(testCase.description, async () => {
                if (testCase.expectedResult && testCase.expectedResult.code === 1) {
                    prismaService.subscription.findUnique.mockResolvedValue(testCase.expectedResult.data);
                    prismaService.subscription.delete.mockResolvedValue(testCase.expectedResult.data);

                    const result = await service.deleteSubscription(testCase.id);
                    expect(result).toEqual(testCase.expectedResult);
                    expect(prismaService.subscription.delete).toHaveBeenCalledWith({
                        where: { id: testCase.id },
                    });
                } else if (testCase.expectedResult) {
                    prismaService.subscription.findUnique.mockResolvedValue(null);
                    await expect(service.deleteSubscription(testCase.id)).rejects.toThrow();
                }
            });
        });
    });
});
