import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "../../src/subscriptions/subscriptions.controller";
import { SubscriptionsService } from "../../src/subscriptions/subscriptions.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
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

describe("SubscriptionsController", () => {
    let controller: SubscriptionsController;
    let subscriptionsService: any;

    beforeEach(async () => {
        const mockSubscriptionsService = {
            getSubscriptions: jest.fn(),
            getSubscription: jest.fn(),
            createSubscription: jest.fn(),
            updateSubscription: jest.fn(),
            deleteSubscription: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubscriptionsController],
            providers: [
                {
                    provide: SubscriptionsService,
                    useValue: mockSubscriptionsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SubscriptionsController>(SubscriptionsController);
        subscriptionsService = module.get(SubscriptionsService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getSubscriptions", () => {
        getSubscriptionsTestCases.forEach((testCase: SubscriptionTestCase) => {
            it(testCase.description, async () => {
                subscriptionsService.getSubscriptions.mockResolvedValue(testCase.expectedResult);
                const result = await controller.getSubscriptions();
                expect(result).toEqual(testCase.expectedResult);
                expect(subscriptionsService.getSubscriptions).toHaveBeenCalled();
            });
        });
    });
    describe("getSubscription", () => {
        getSubscriptionTestCases.forEach((testCase: GetSubscriptionTestCase) => {
            it(testCase.description, async () => {
                subscriptionsService.getSubscription.mockResolvedValue(testCase.expectedResult);
                const result = await controller.getSubscription(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(subscriptionsService.getSubscription).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
    describe("createSubscription", () => {
        createSubscriptionTestCases.forEach((testCase: CreateSubscriptionTestCase) => {
            it(testCase.description, async () => {
                subscriptionsService.createSubscription.mockResolvedValue(testCase.expectedResult);
                const result = await controller.createSubscription(testCase.data);
                expect(result).toEqual(testCase.expectedResult);
                expect(subscriptionsService.createSubscription).toHaveBeenCalledWith(testCase.data);
            });
        });
    });

    describe("updateSubscription", () => {
        updateSubscriptionTestCases.forEach((testCase: UpdateSubscriptionTestCase) => {
            it(testCase.description, async () => {
                subscriptionsService.updateSubscription.mockResolvedValue(testCase.expectedResult);
                const result = await controller.updateSubscription(testCase.id, testCase.data);
                expect(result).toEqual(testCase.expectedResult);
                expect(subscriptionsService.updateSubscription).toHaveBeenCalledWith(
                    testCase.id,
                    testCase.data
                );
            });
        });
    });

    describe("deleteSubscription", () => {
        deleteSubscriptionTestCases.forEach((testCase: DeleteSubscriptionTestCase) => {
            it(testCase.description, async () => {
                subscriptionsService.deleteSubscription.mockResolvedValue(testCase.expectedResult);
                const result = await controller.deleteSubscription(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(subscriptionsService.deleteSubscription).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
