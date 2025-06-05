/**
 * Application error types
 * Follows Open/Closed Principle by allowing extension of error types
 */
export abstract class AppError extends Error {
    abstract readonly type: string;
    abstract readonly statusCode: number;

    constructor(message: string, public readonly context?: any) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    readonly type = "VALIDATION_ERROR";
    readonly statusCode = 400;
}

export class NotFoundError extends AppError {
    readonly type = "NOT_FOUND_ERROR";
    readonly statusCode = 404;
}

export class NetworkError extends AppError {
    readonly type = "NETWORK_ERROR";
    readonly statusCode = 500;
}

export class UnauthorizedError extends AppError {
    readonly type = "UNAUTHORIZED_ERROR";
    readonly statusCode = 401;
}

/**
 * Error handler strategy interface
 */
export interface IErrorHandler {
    handle(error: AppError): void;
}

/**
 * Console error handler
 */
export class ConsoleErrorHandler implements IErrorHandler {
    handle(error: AppError): void {
        console.error(`[${error.type}] ${error.message}`, error.context);
    }
}

/**
 * UI error handler
 */
export class UIErrorHandler implements IErrorHandler {
    constructor(private showError: (message: string) => void) {}

    handle(error: AppError): void {
        this.showError(error.message);
    }
}

/**
 * Error service with strategy pattern
 */
export class ErrorService {
    private handlers: IErrorHandler[] = [];

    addHandler(handler: IErrorHandler): void {
        this.handlers.push(handler);
    }

    handleError(error: Error | AppError): void {
        const appError =
            error instanceof AppError ? error : new NetworkError(error.message);

        this.handlers.forEach((handler) => handler.handle(appError));
    }
}
