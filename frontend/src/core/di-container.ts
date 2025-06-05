/**
 * Simple Dependency Injection Container
 * Follows Dependency Inversion Principle by managing dependencies
 */
export class DIContainer {
    private static instance: DIContainer;
    private services = new Map<string, any>();
    private singletons = new Map<string, any>();

    private constructor() {}

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    register<T>(token: string, factory: () => T): void {
        this.services.set(token, factory);
    }

    registerSingleton<T>(token: string, factory: () => T): void {
        this.register(token, () => {
            if (!this.singletons.has(token)) {
                this.singletons.set(token, factory());
            }
            return this.singletons.get(token);
        });
    }

    resolve<T>(token: string): T {
        const factory = this.services.get(token);
        if (!factory) {
            throw new Error(`Service ${token} not registered`);
        }
        return factory();
    }

    clear(): void {
        this.services.clear();
        this.singletons.clear();
    }
}

// Service tokens
export const SERVICE_TOKENS = {
    // Repositories
    USER_REPOSITORY: "UserRepository",
    BUILDING_REPOSITORY: "BuildingRepository",
    APARTMENT_REPOSITORY: "ApartmentRepository",
    SERVICE_REPOSITORY: "ServiceRepository",
    PAYMENT_REPOSITORY: "PaymentRepository",

    // Domain Services
    USER_SERVICE: "UserService",
    BUILDING_SERVICE: "BuildingService",
    APARTMENT_SERVICE: "ApartmentService",
    GROWTH_DATA_SERVICE: "GrowthDataService",

    // Other Services
    SEARCH_SERVICE: "SearchService",
    ERROR_SERVICE: "ErrorService",
} as const;
