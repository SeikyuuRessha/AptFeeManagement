import { AppException } from "../exception/app-exception";
import { ExceptionCode } from "../exception/exception-code";

export async function handleService<T>(
    fn: () => Promise<T>,
    successMessage?: string,
    fallbackError = ExceptionCode.INTERNAL_SERVER_ERROR
) {
    try {
        const data = await fn();
        return {
            code: 1,
            msg: successMessage || "Success",
            data,
        };
    } catch (error) {
        if (error instanceof AppException) {
            throw error;
        }

        throw new AppException(fallbackError, { originalError: error?.toString() });
    }
}
