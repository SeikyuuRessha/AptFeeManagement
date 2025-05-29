import { Test, TestingModule } from "@nestjs/testing";
import { ContractsController } from "../../src/contracts/contracts.controller";
import { ContractsService } from "../../src/contracts/contracts.service";
import { AccessTokenGuard } from "../../src/common/guards/accessToken.guard";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import {
    mockContracts,
    getContractsTestCases,
    getContractTestCases,
    createContractTestCases,
    updateContractTestCases,
    deleteContractTestCases,
} from "./contracts.test-cases";

describe("ContractsController", () => {
    let controller: ContractsController;
    let service: any;

    beforeEach(async () => {
        const mockContractsService = {
            getContracts: jest.fn(),
            getContract: jest.fn(),
            createContract: jest.fn(),
            updateContract: jest.fn(),
            deleteContract: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContractsController],
            providers: [
                {
                    provide: ContractsService,
                    useValue: mockContractsService,
                },
            ],
        })
            .overrideGuard(AccessTokenGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<ContractsController>(ContractsController);
        service = module.get(ContractsService);
    });

    describe("getContracts", () => {
        getContractsTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getContracts.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getContracts();
                expect(result).toEqual(testCase.expectedResult);
                expect(service.getContracts).toHaveBeenCalled();
            });
        });
    });

    describe("getContract", () => {
        getContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.getContract.mockResolvedValue(testCase.expectedResult);

                const result = await controller.getContract(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.getContract).toHaveBeenCalledWith(testCase.id);
            });
        });
    });

    describe("createContract", () => {
        createContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                const mockRequest = {
                    user: { sub: testCase.residentId },
                } as any;

                service.createContract.mockResolvedValue(testCase.expectedResult);

                const result = await controller.createContract(testCase.data, mockRequest);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.createContract).toHaveBeenCalledWith(
                    testCase.data,
                    testCase.residentId
                );
            });
        });
    });

    describe("updateContract", () => {
        updateContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.updateContract.mockResolvedValue(testCase.expectedResult);

                const result = await controller.updateContract(testCase.id, testCase.data);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.updateContract).toHaveBeenCalledWith(testCase.id, testCase.data);
            });
        });
    });

    describe("deleteContract", () => {
        deleteContractTestCases.forEach((testCase) => {
            it(testCase.description, async () => {
                service.deleteContract.mockResolvedValue(testCase.expectedResult);

                const result = await controller.deleteContract(testCase.id);
                expect(result).toEqual(testCase.expectedResult);
                expect(service.deleteContract).toHaveBeenCalledWith(testCase.id);
            });
        });
    });
});
