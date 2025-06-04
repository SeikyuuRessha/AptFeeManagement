import { DIContainer, SERVICE_TOKENS } from "./di-container";
import { UserRepository } from "../repositories/user.repository";
import {
    BuildingRepository,
    ApartmentRepository,
} from "../repositories/building.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { UserService } from "../services/domain/user.service";
import { GrowthDataService } from "../services/domain/growth-data.service";
import { UserSearchStrategy } from "../strategies/search.strategies";
import { ErrorService } from "../core/error-handling";
import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import {
    IBuildingRepository,
    IApartmentRepository,
} from "../interfaces/repositories/building.repository.interface";
import { IServiceRepository } from "../interfaces/repositories/service.repository.interface";
import { IPaymentRepository } from "../interfaces/repositories/payment.repository.interface";

// Re-export SERVICE_TOKENS for convenience
export { SERVICE_TOKENS };

/**
 * Application bootstrap - configures all dependencies
 * Follows Dependency Inversion Principle by wiring up abstractions
 */
export class AppBootstrap {
    private static initialized = false;

    static initialize(): void {
        if (this.initialized) return;

        const container = DIContainer.getInstance(); // Register repositories
        container.registerSingleton(
            SERVICE_TOKENS.USER_REPOSITORY,
            () => new UserRepository()
        );
        container.registerSingleton(
            SERVICE_TOKENS.BUILDING_REPOSITORY,
            () => new BuildingRepository()
        );
        container.registerSingleton(
            SERVICE_TOKENS.APARTMENT_REPOSITORY,
            () => new ApartmentRepository()
        );
        container.registerSingleton(
            SERVICE_TOKENS.SERVICE_REPOSITORY,
            () => new ServiceRepository()
        );
        container.registerSingleton(
            SERVICE_TOKENS.PAYMENT_REPOSITORY,
            () => new PaymentRepository()
        ); // Register services with their dependencies
        container.registerSingleton(SERVICE_TOKENS.USER_SERVICE, () => {
            const userRepository = container.resolve<IUserRepository>(
                SERVICE_TOKENS.USER_REPOSITORY
            );
            return new UserService(userRepository);
        });

        container.registerSingleton(SERVICE_TOKENS.GROWTH_DATA_SERVICE, () => {
            const userRepository = container.resolve<IUserRepository>(
                SERVICE_TOKENS.USER_REPOSITORY
            );
            const buildingRepository = container.resolve<IBuildingRepository>(
                SERVICE_TOKENS.BUILDING_REPOSITORY
            );
            const apartmentRepository = container.resolve<IApartmentRepository>(
                SERVICE_TOKENS.APARTMENT_REPOSITORY
            );
            const paymentRepository = container.resolve<IPaymentRepository>(
                SERVICE_TOKENS.PAYMENT_REPOSITORY
            );
            return new GrowthDataService(
                userRepository,
                buildingRepository,
                apartmentRepository,
                paymentRepository
            );
        });

        // Register error service
        container.registerSingleton(
            SERVICE_TOKENS.ERROR_SERVICE,
            () => new ErrorService()
        );

        // Register search strategies
        container.register(
            "UserSearchStrategy",
            () => new UserSearchStrategy()
        );

        this.initialized = true;
    }

    static getService<T>(token: string): T {
        const container = DIContainer.getInstance();
        return container.resolve<T>(token);
    }
}
